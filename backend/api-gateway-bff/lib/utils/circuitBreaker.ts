interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  failureCount: number
  lastFailureTime: number
  successCount: number
}

interface CircuitBreakerConfig {
  failureThreshold: number
  recoveryTimeout: number
  successThreshold: number
  timeout: number
}

export class CircuitBreaker {
  private state: CircuitBreakerState
  private config: CircuitBreakerConfig

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      recoveryTimeout: config.recoveryTimeout || 60000, // 1 minute
      successThreshold: config.successThreshold || 3,
      timeout: config.timeout || 10000 // 10 seconds
    }

    this.state = {
      state: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      successCount: 0
    }
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state.state === 'OPEN') {
      if (Date.now() - this.state.lastFailureTime > this.config.recoveryTimeout) {
        this.state.state = 'HALF_OPEN'
        this.state.successCount = 0
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await this.withTimeout(operation, this.config.timeout)
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private async withTimeout<T>(operation: () => Promise<T>, timeout: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Operation timeout'))
      }, timeout)

      operation()
        .then(result => {
          clearTimeout(timer)
          resolve(result)
        })
        .catch(error => {
          clearTimeout(timer)
          reject(error)
        })
    })
  }

  private onSuccess(): void {
    this.state.failureCount = 0

    if (this.state.state === 'HALF_OPEN') {
      this.state.successCount++
      if (this.state.successCount >= this.config.successThreshold) {
        this.state.state = 'CLOSED'
        this.state.successCount = 0
      }
    }
  }

  private onFailure(): void {
    this.state.failureCount++
    this.state.lastFailureTime = Date.now()

    if (this.state.failureCount >= this.config.failureThreshold) {
      this.state.state = 'OPEN'
    }
  }

  getState(): CircuitBreakerState {
    return { ...this.state }
  }

  reset(): void {
    this.state = {
      state: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      successCount: 0
    }
  }
}

// Circuit breaker instances for each service
export const circuitBreakers = {
  auth: new CircuitBreaker({
    failureThreshold: 3,
    recoveryTimeout: 30000,
    successThreshold: 2,
    timeout: 5000
  }),
  contract: new CircuitBreaker({
    failureThreshold: 5,
    recoveryTimeout: 60000,
    successThreshold: 3,
    timeout: 10000
  }),
  ai: new CircuitBreaker({
    failureThreshold: 3,
    recoveryTimeout: 120000, // 2 minutes for AI processing
    successThreshold: 2,
    timeout: 30000
  }),
  file: new CircuitBreaker({
    failureThreshold: 5,
    recoveryTimeout: 60000,
    successThreshold: 3,
    timeout: 15000
  })
}

// Wrapper function to use circuit breaker with service calls
export async function withCircuitBreaker<T>(
  serviceName: keyof typeof circuitBreakers,
  operation: () => Promise<T>
): Promise<T> {
  const breaker = circuitBreakers[serviceName]
  return breaker.execute(operation)
}

export default CircuitBreaker
