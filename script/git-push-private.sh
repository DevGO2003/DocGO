#!/bin/bash

# Git Push Private - AI-Powered Smart Merge
# Tác giả: DocGO Development Team
# Phiên bản: 1.0.0
# Mô tả: Script thông minh để push code và env files lên private remote với Smart Merge

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_smart() {
    echo -e "${PURPLE}[SMART]${NC} $1"
}

# Configuration
BACKUP_DIR=".git-backup/env"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"

# Function to get current branch
get_current_branch() {
    local branch=$(git branch --show-current 2>/dev/null || echo "main")
    echo "$branch"
}

# Function to create backup directory
create_backup_dir() {
    mkdir -p "$BACKUP_PATH"
    log_info "Tạo thư mục backup: $BACKUP_PATH"
}

# Function: Smart Backup - Backup all .env files
smart_backup() {
    log_smart "🔄 Thực hiện Smart Backup..."
    
    create_backup_dir
    
    # Find all .env files
    local env_files=($(find . -name ".env*" -type f 2>/dev/null || true))
    
    if [ ${#env_files[@]} -eq 0 ]; then
        log_warning "Không tìm thấy file .env nào để backup"
        return 0
    fi
    
    log_info "Tìm thấy ${#env_files[@]} file .env:"
    for file in "${env_files[@]}"; do
        echo "  - $file"
    done
    
    # Copy all .env files to backup
    for file in "${env_files[@]}"; do
        local relative_path=$(echo "$file" | sed 's|^\./||')
        local backup_file="$BACKUP_PATH/$relative_path"
        local backup_dir=$(dirname "$backup_file")
        
        mkdir -p "$backup_dir"
        cp "$file" "$backup_file"
        log_success "Backup: $file -> $backup_file"
    done
    
    log_success "✅ Smart Backup hoàn thành"
}

# Function: Security Check - Remove .env files from Git tracking
security_check() {
    log_smart "🔒 Thực hiện Security Check..."
    
    # Find tracked .env files
    local tracked_env_files=($(git ls-files | grep -E "\.env" || true))
    
    if [ ${#tracked_env_files[@]} -eq 0 ]; then
        log_info "Không có file .env nào đang được Git theo dõi"
        return 0
    fi
    
    log_warning "Phát hiện ${#tracked_env_files[@]} file .env đang được Git theo dõi:"
    for file in "${tracked_env_files[@]}"; do
        echo "  - $file"
    done
    
    # Unstage and remove from tracking
    for file in "${tracked_env_files[@]}"; do
        git reset HEAD "$file" 2>/dev/null || true
        git rm --cached "$file" 2>/dev/null || true
        log_success "Đã bỏ theo dõi: $file"
    done
    
    # Create cleanup commit if there were tracked files
    if [ ${#tracked_env_files[@]} -gt 0 ]; then
        git add -A
        if ! git diff --cached --quiet; then
            git commit -m "🧹 Security Check: Remove .env files from tracking
            
            - Removed ${#tracked_env_files[@]} .env files from Git tracking
            - Ensures origin repository remains clean and secure
            - Files are still available locally but not tracked"
            log_success "✅ Tạo commit dọn dẹp Security Check"
        fi
    fi
    
    log_success "✅ Security Check hoàn thành"
}

# Function: Push code to origin (without .env files)
push_to_origin() {
    log_smart "📤 Push code lên origin (không env files)..."
    
    local current_branch=$(get_current_branch)
    
    # Stage all changes except .env files
    git add -A
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        log_info "Không có thay đổi code nào để commit"
        return 0
    fi
    
    # Commit code changes
    git commit -m "🚀 Code changes - Auto push to origin

    - Pushed by git-push-private.sh
    - Excludes .env files for security
    - Branch: $current_branch"
    
    # Push to origin
    git push origin "$current_branch"
    log_success "✅ Push code lên origin/$current_branch thành công"
}

# Function: AI-Powered Smart Merge Algorithm
smart_merge_env() {
    local env_file="$1"
    local remote_env="$2"
    local merged_env="$3"
    
    log_smart "🤖 Thực hiện AI-Powered Smart Merge cho $env_file..."
    
    # Create temporary files for analysis
    local local_keys_file=$(mktemp)
    local remote_keys_file=$(mktemp)
    local merged_keys_file=$(mktemp)
    
    # Extract keys from local file
    if [ -f "$env_file" ]; then
        grep -E "^[A-Z_][A-Z0-9_]*=" "$env_file" | cut -d'=' -f1 | sort > "$local_keys_file"
    fi
    
    # Extract keys from remote file
    if [ -f "$remote_env" ]; then
        grep -E "^[A-Z_][A-Z0-9_]*=" "$remote_env" | cut -d'=' -f1 | sort > "$remote_keys_file"
    fi
    
    # Analyze conflicts
    local common_keys=$(comm -12 "$local_keys_file" "$remote_keys_file" | wc -l)
    local local_only=$(comm -23 "$local_keys_file" "$remote_keys_file" | wc -l)
    local remote_only=$(comm -13 "$local_keys_file" "$remote_keys_file" | wc -l)
    
    log_info "Phân tích xung đột:"
    log_info "  - Khóa chung: $common_keys"
    log_info "  - Chỉ có local: $local_only"
    log_info "  - Chỉ có remote: $remote_only"
    
    # Start with remote file as base
    if [ -f "$remote_env" ]; then
        cp "$remote_env" "$merged_env"
    else
        touch "$merged_env"
    fi
    
    # Apply Smart Merge rules
    if [ -f "$env_file" ]; then
        while IFS='=' read -r key value; do
            # Skip empty lines and comments
            [[ -z "$key" || "$key" =~ ^# ]] && continue
            
            # Apply decision rules
            local decision="remote"
            
            # Rule 1: Database URLs - prefer remote
            if [[ "$key" =~ (DATABASE_URL|MONGODB_URI|DB_) ]]; then
                decision="remote"
                log_info "  🔄 $key: Ưu tiên Remote (Database)"
            
            # Rule 2: API Keys and Secrets - prefer local
            elif [[ "$key" =~ (API_KEY|SECRET|TOKEN|PASSWORD) ]]; then
                decision="local"
                log_info "  🔄 $key: Ưu tiên Local (API Keys)"
            
            # Rule 3: Port/Host - prefer local
            elif [[ "$key" =~ (PORT|HOST|SERVER_) ]]; then
                decision="local"
                log_info "  🔄 $key: Ưu tiên Local (Port/Host)"
            
            # Rule 4: Debug flags - merge with logic
            elif [[ "$key" =~ (DEBUG|ENABLE|DISABLE) ]]; then
                if [[ "$value" == "true" ]]; then
                    decision="local"
                    log_info "  🔄 $key: Ưu tiên Local (Debug=true)"
                else
                    decision="remote"
                    log_info "  🔄 $key: Ưu tiên Remote (Debug=false)"
                fi
            
            # Rule 5: Default - prefer local for new keys
            else
                decision="local"
                log_info "  🔄 $key: Ưu tiên Local (Default)"
            fi
            
            # Apply decision
            if [ "$decision" == "local" ]; then
                # Remove existing key from merged file
                sed -i "/^$key=/d" "$merged_env" 2>/dev/null || true
                # Add local key
                echo "$key=$value" >> "$merged_env"
            fi
            
        done < "$env_file"
    fi
    
    # Clean up temporary files
    rm -f "$local_keys_file" "$remote_keys_file" "$merged_keys_file"
    
    log_success "✅ Smart Merge hoàn thành cho $env_file"
}

# Function: Force-add env files and push to private
push_to_private() {
    log_smart "🔐 Push code + env lên private..."
    
    local current_branch=$(get_current_branch)
    local param_branch="$1"
    
    # Force-add all .env files
    local env_files=($(find . -name ".env*" -type f 2>/dev/null || true))
    
    if [ ${#env_files[@]} -gt 0 ]; then
        log_info "Force-add ${#env_files[@]} file .env:"
        for file in "${env_files[@]}"; do
            git add -f "$file"
            echo "  - $file"
        done
        
        # Commit env files
        git commit -m "🔐 Environment files - Private sync

        - Added ${#env_files[@]} .env files to private repository
        - Files: $(printf '%s ' "${env_files[@]}")
        - Branch: $current_branch"
        
        log_success "✅ Commit env files thành công"
    fi
    
    # Push to private/<current-branch>
    log_info "Push lên private/$current_branch..."
    git push private "$current_branch"
    log_success "✅ Push lên private/$current_branch thành công"
    
    # Push to private/<param> if parameter provided
    if [ -n "$param_branch" ]; then
        log_info "Push lên private/$param_branch..."
        git push private "$current_branch:$param_branch"
        log_success "✅ Push lên private/$param_branch thành công"
    fi
}

# Function: Cleanup local history
cleanup_local_history() {
    log_smart "🧹 Cleanup local history..."
    
    # Reset to remove env commit
    git reset --hard HEAD~1
    log_success "✅ Đã xóa commit env khỏi local history"
}

# Function: Sync from private
sync_from_private() {
    log_smart "🔄 Đồng bộ từ private..."
    
    local current_branch=$(get_current_branch)
    
    # Fetch from private
    git fetch private
    log_info "Fetch từ private remote"
    
    # Reset to private branch
    git reset --hard "private/$current_branch"
    log_success "✅ Đồng bộ với private/$current_branch"
}

# Function: Prevent env tracking
prevent_env_tracking() {
    log_smart "🛡️ Ngăn env bị track ở local..."
    
    # Add .env patterns to .git/info/exclude
    local exclude_file=".git/info/exclude"
    
    # Check if patterns already exist
    if ! grep -q "\.env" "$exclude_file" 2>/dev/null; then
        echo "" >> "$exclude_file"
        echo "# Prevent .env files from being tracked" >> "$exclude_file"
        echo ".env*" >> "$exclude_file"
        echo "*.env" >> "$exclude_file"
        log_success "✅ Đã thêm .env patterns vào .git/info/exclude"
    else
        log_info "Patterns .env đã tồn tại trong .git/info/exclude"
    fi
}

# Function: Final sync
final_sync() {
    log_smart "🔄 Pull để đồng bộ hoàn chỉnh..."
    
    local current_branch=$(get_current_branch)
    
    # Pull from private
    git pull private "$current_branch"
    log_success "✅ Đồng bộ hoàn chỉnh với private/$current_branch"
}

# Function: Smart Rollback
smart_rollback() {
    log_error "🔄 Kích hoạt Smart Rollback..."
    
    if [ -d "$BACKUP_PATH" ]; then
        log_info "Khôi phục từ backup: $BACKUP_PATH"
        
        # Restore .env files from backup
        find "$BACKUP_PATH" -name ".env*" -type f | while read -r backup_file; do
            local relative_path=$(echo "$backup_file" | sed "s|$BACKUP_PATH/||")
            local target_file="./$relative_path"
            local target_dir=$(dirname "$target_file")
            
            mkdir -p "$target_dir"
            cp "$backup_file" "$target_file"
            log_success "Khôi phục: $target_file"
        done
        
        log_success "✅ Smart Rollback hoàn thành"
    else
        log_error "Không tìm thấy backup để rollback"
    fi
}

# Main execution function
main() {
    local param_branch="$1"
    local current_branch=$(get_current_branch)
    
    log_info "🚀 Bắt đầu Git Push Private - AI-Powered Smart Merge"
    log_info "Current branch: $current_branch"
    if [ -n "$param_branch" ]; then
        log_info "Parameter branch: $param_branch"
    fi
    
    # Step 1: Determine current branch (already done above)
    log_success "✅ Bước 1: Xác định nhánh hiện tại ($current_branch)"
    
    # Step 2: Smart Backup
    smart_backup
    log_success "✅ Bước 2: Smart Backup hoàn thành"
    
    # Step 3: Security Check
    security_check
    log_success "✅ Bước 3: Security Check hoàn thành"
    
    # Step 4: Push code to origin
    push_to_origin
    log_success "✅ Bước 4: Push code lên origin hoàn thành"
    
    # Step 5: Push code + env to private
    push_to_private "$param_branch"
    log_success "✅ Bước 5: Push code + env lên private hoàn thành"
    
    # Step 6: Cleanup local history
    cleanup_local_history
    log_success "✅ Bước 6: Cleanup local history hoàn thành"
    
    # Step 7: Sync from private
    sync_from_private
    log_success "✅ Bước 7: Đồng bộ từ private hoàn thành"
    
    # Step 8: Prevent env tracking
    prevent_env_tracking
    log_success "✅ Bước 8: Ngăn env bị track hoàn thành"
    
    # Step 9: Final sync
    final_sync
    log_success "✅ Bước 9: Đồng bộ hoàn chỉnh hoàn thành"
    
    log_success "🎉 Git Push Private hoàn thành thành công!"
    log_info "📊 Tóm tắt:"
    log_info "  - Backup: $BACKUP_PATH"
    log_info "  - Origin: origin/$current_branch"
    log_info "  - Private: private/$current_branch"
    if [ -n "$param_branch" ]; then
        log_info "  - Private param: private/$param_branch"
    fi
}

# Error handling
trap 'log_error "❌ Script bị lỗi tại dòng $LINENO"; smart_rollback; exit 1' ERR

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "Không phải là Git repository"
    exit 1
fi

# Check if private remote exists
if ! git remote get-url private > /dev/null 2>&1; then
    log_error "Remote 'private' không tồn tại"
    log_info "Hãy thêm remote private: git remote add private <url>"
    exit 1
fi

# Execute main function
main "$@"
