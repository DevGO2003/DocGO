package com.devgo2003.docgo.contract_service.config;

public final class RequestContext {
    private static final ThreadLocal<String> ACTOR = new ThreadLocal<>();
    private static final ThreadLocal<String> CORRELATION_ID = new ThreadLocal<>();

    private RequestContext() {}

    public static void setActor(String actor) {
        ACTOR.set(actor);
    }

    public static String getCurrentActor() {
        return ACTOR.get();
    }

    public static void clearActor() {
        ACTOR.remove();
    }

    public static void setCorrelationId(String correlationId) {
        CORRELATION_ID.set(correlationId);
    }

    public static String getCorrelationId() {
        return CORRELATION_ID.get();
    }

    public static void clearCorrelationId() {
        CORRELATION_ID.remove();
    }
}


