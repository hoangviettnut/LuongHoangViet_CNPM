const API_BASE_URL = window.API_BASE_URL || "http://localhost:1880";

const elements = {
    loginSection: document.getElementById("login-section"),
    coursesSection: document.getElementById("courses-section"),
    courseDetailSection: document.getElementById("course-detail-section"),
    progressSection: document.getElementById("progress-section"),
    forumSection: document.getElementById("forum-section"),
    forumPostDetailSection: document.getElementById("forum-post-detail-section"),
    loginForm: document.getElementById("login-form"),
    loginMessage: document.getElementById("login-message"),
    coursesList: document.getElementById("courses-list"),
    courseDetail: document.getElementById("course-detail"),
    progressList: document.getElementById("progress-list"),
    forumPostsList: document.getElementById("forum-posts-list"),
    forumPostDetail: document.getElementById("forum-post-detail"),
    btnViewCourses: document.getElementById("btn-view-courses"),
    btnViewProgress: document.getElementById("btn-view-progress"),
    btnViewForum: document.getElementById("btn-view-forum"),
    btnCreatePost: document.getElementById("btn-create-post"),
    btnCancelPost: document.getElementById("btn-cancel-post"),
    createPostForm: document.getElementById("create-post-form"),
    postForm: document.getElementById("post-form"),
    postMessage: document.getElementById("post-message"),
    closePostDetail: document.getElementById("close-post-detail"),
    btnLogout: document.getElementById("btn-logout"),
    closeCourseDetail: document.getElementById("close-course-detail"),
    roleHint: document.getElementById("role-hint"),
    userSummary: document.getElementById("user-summary"),
    userName: document.getElementById("user-name"),
    userRoles: document.getElementById("user-roles"),
    userAvatar: document.getElementById("user-avatar"),
    registerSection: document.getElementById("register-section"),
    registerForm: document.getElementById("register-form"),
    registerMessage: document.getElementById("register-message"),
    authTabLogin: document.getElementById("auth-tab-login"),
    authTabRegister: document.getElementById("auth-tab-register"),
    authPanel: document.getElementById("auth-panel"),
    profileSection: document.getElementById("profile-section"),
    changePasswordForm: document.getElementById("change-password-form"),
    changePasswordMessage: document.getElementById("change-password-message"),
    settingsPanel: document.getElementById("settings-panel"),
    btnOpenSettings: document.getElementById("btn-open-settings"),
    settingsAvatar: document.getElementById("settings-avatar"),
    settingsName: document.getElementById("settings-name"),
    settingsRoles: document.getElementById("settings-roles"),
    closeSettings: document.getElementById("close-settings"),
    openChangePassword: document.getElementById("open-change-password"),
    themeToggle: document.getElementById("theme-toggle"),
    coursesSearchInput: document.getElementById("course-search"),
    coursesSearchClear: document.getElementById("course-search-clear"),
    languageFilters: document.getElementById("language-filters"),
    languageFilterClear: document.getElementById("language-filter-clear"),
    btnCreateCourse: document.getElementById("btn-create-course"),
    courseCreateSection: document.getElementById("course-create-section"),
    createCourseForm: document.getElementById("create-course-form"),
    createCourseMessage: document.getElementById("create-course-message"),
    btnCancelCreateCourse: document.getElementById("btn-cancel-create-course"),
    btnResetCreateCourse: document.getElementById("btn-reset-create-course"),
    createCourseLanguage: document.getElementById("create-course-language"),
    createCourseLanguageHint: document.getElementById("create-course-language-hint"),
    toast: document.getElementById("toast"),
    toastIcon: document.getElementById("toast-icon"),
    toastTitle: document.getElementById("toast-title"),
    toastMessage: document.getElementById("toast-message"),
    toastClose: document.getElementById("toast-close"),
    btnLogin: document.getElementById("btn-login")
};

setLanguageSelectPlaceholder("Đang tải danh sách ngôn ngữ...", true);

let currentUser = null;

const USER_STORAGE_KEY = "elearn_current_user";
let allCourses = [];
let currentCourseSearch = "";
let currentLanguageFilter = null;
let currentChatConversation = null;
let chatRefreshInterval = null;
let programmingLanguages = [];
let programmingLanguagesLoaded = false;
let programmingLanguagesLoading = false;
const LESSON_CONTENT_TYPES = [
    { value: "video", label: "Video" },
    { value: "article", label: "Bài viết" },
    { value: "quiz", label: "Quiz" },
    { value: "project", label: "Dự án" },
    { value: "exercise", label: "Bài tập" }
];
const DEFAULT_LESSON_TYPE = "video";

function setMessage(type, text) {
    if (!type || !text) {
        elements.loginMessage.className = "message";
        elements.loginMessage.textContent = text || "";
        return;
    }
    elements.loginMessage.className = `message ${type}`;
    elements.loginMessage.textContent = text;
}

function setRegisterMessage(type, text) {
    if (!elements.registerMessage) return;
    if (!type || !text) {
        elements.registerMessage.className = "message";
        elements.registerMessage.textContent = text || "";
        return;
    }
    elements.registerMessage.className = `message ${type}`;
    elements.registerMessage.textContent = text;
}

function setChangePasswordMessage(type, text) {
    if (!elements.changePasswordMessage) return;
    if (!type || !text) {
        elements.changePasswordMessage.className = "message";
        elements.changePasswordMessage.textContent = text || "";
        return;
    }
    elements.changePasswordMessage.className = `message ${type}`;
    elements.changePasswordMessage.textContent = text;
}

function setCreateCourseMessage(type, text) {
    if (!elements.createCourseMessage) return;
    if (!type || !text) {
        elements.createCourseMessage.className = "message";
        elements.createCourseMessage.textContent = text || "";
        return;
    }
    elements.createCourseMessage.className = `message ${type}`;
    elements.createCourseMessage.textContent = text;
}

function setLanguageSelectPlaceholder(text, disabled = true) {
    const select = elements.createCourseLanguage;
    if (!select) return;
    select.innerHTML = `<option value="" disabled selected>${text}</option>`;
    select.disabled = !!disabled;
    if (elements.createCourseLanguageHint) {
        elements.createCourseLanguageHint.textContent = text;
    }
}

function renderProgrammingLanguageOptions() {
    const select = elements.createCourseLanguage;
    if (!select) return;

    if (!programmingLanguages.length) {
        setLanguageSelectPlaceholder(
            "Chưa có ngôn ngữ nào được cấu hình. Hãy bổ sung trong hệ thống.",
            true
        );
        return;
    }

    const optionsHtml = [
        `<option value="" disabled selected>-- Chọn ngôn ngữ lập trình --</option>`,
        ...programmingLanguages.map(
            (lang) => `<option value="${lang.name}">${lang.name}</option>`
        )
    ];
    select.innerHTML = optionsHtml.join("");
    select.disabled = false;
    select.value = "";
    if (elements.createCourseLanguageHint) {
        elements.createCourseLanguageHint.textContent = "Chọn ngôn ngữ đã được cấu hình trong hệ thống.";
    }
}

async function loadProgrammingLanguages(force = false) {
    if (programmingLanguagesLoading) return programmingLanguages;
    if (!force && programmingLanguagesLoaded && programmingLanguages.length) {
        renderProgrammingLanguageOptions();
        return programmingLanguages;
    }
    programmingLanguagesLoading = true;
    setLanguageSelectPlaceholder("Đang tải danh sách ngôn ngữ...", true);
    try {
        const langs = await apiRequest("/languages");
        programmingLanguages = Array.isArray(langs) ? langs : [];
        programmingLanguagesLoaded = true;
        renderProgrammingLanguageOptions();
    } catch (err) {
        console.error("Không thể tải danh sách ngôn ngữ", err);
        programmingLanguagesLoaded = false;
        setLanguageSelectPlaceholder("Không thể tải danh sách ngôn ngữ. Thử lại sau.", true);
    } finally {
        programmingLanguagesLoading = false;
    }
    return programmingLanguages;
}

const THEME_STORAGE_KEY = "elearn_theme";
function applyTheme(theme) {
    const normalized = theme === "light" ? "light" : "dark";
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${normalized}`);
    if (elements.themeToggle) {
        elements.themeToggle.textContent = normalized === "dark" ? "🌙" : "☀";
        elements.themeToggle.title = normalized === "dark"
            ? "Chuyển sang giao diện sáng"
            : "Chuyển sang giao diện tối";
    }
    localStorage.setItem(THEME_STORAGE_KEY, normalized);
}

let toastTimeout = null;
function showToast({ title = "Thông báo", message = "", type = "info" }) {
    if (!elements.toast) return;
    clearTimeout(toastTimeout);
    elements.toast.classList.remove("hidden", "toast--success", "toast--info", "toast--error", "show");
    elements.toast.classList.add(`toast--${type}`);
    if (elements.toastTitle) elements.toastTitle.textContent = title;
    if (elements.toastMessage) elements.toastMessage.textContent = message;
    if (elements.toastIcon) {
        elements.toastIcon.textContent = type === "success" ? "✓" : type === "error" ? "!" : "ℹ";
    }
    requestAnimationFrame(() => elements.toast.classList.add("show"));
    toastTimeout = setTimeout(hideToast, 4000);
}

function hideToast() {
    if (!elements.toast) return;
    elements.toast.classList.remove("show");
    toastTimeout = setTimeout(() => elements.toast.classList.add("hidden"), 250);
}

function toggleSection(section, show) {
    if (!section) return;
    section.classList.toggle("hidden", !show);
}

function applyCourseSearch() {
    if (!Array.isArray(allCourses)) {
        renderCourseList([]);
        return;
    }
    
    let filtered = allCourses;
    
    // Apply language filter
    if (currentLanguageFilter) {
        filtered = filtered.filter(course => 
            (course.language_name || "").toLowerCase() === currentLanguageFilter.toLowerCase()
        );
    }
    
    // Apply search keyword
    const keyword = (currentCourseSearch || "").trim().toLowerCase();
    if (keyword) {
        filtered = filtered.filter(course => {
            const title = (course.title || "").toLowerCase();
            const shortDesc = (course.short_description || "").toLowerCase();
            const lang = (course.language_name || "").toLowerCase();
            const instructor = (course.instructor_name || "").toLowerCase();
            return (
                title.includes(keyword) ||
                shortDesc.includes(keyword) ||
                lang.includes(keyword) ||
                instructor.includes(keyword)
            );
        });
    }
    
    renderCourseList(filtered);
}

function extractLanguagesFromCourses(courses) {
    if (!Array.isArray(courses)) return [];
    const languages = new Set();
    courses.forEach(course => {
        if (course.language_name) {
            languages.add(course.language_name);
        }
    });
    return Array.from(languages).sort();
}

function renderLanguageFilters() {
    if (!elements.languageFilters) return;
    
    const languages = extractLanguagesFromCourses(allCourses);
    
    if (languages.length === 0) {
        elements.languageFilters.innerHTML = "<p class=\"hint\">Chưa có ngôn ngữ nào.</p>";
        return;
    }
    
    elements.languageFilters.innerHTML = languages.map(lang => `
        <button 
            class="language-filter-btn ${currentLanguageFilter === lang ? 'language-filter-btn--active' : ''}" 
            data-language="${lang}"
            type="button"
        >
            ${lang}
        </button>
    `).join("");
    
    // Add event listeners
    elements.languageFilters.querySelectorAll(".language-filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedLang = btn.dataset.language;
            if (currentLanguageFilter === selectedLang) {
                // Deselect
                currentLanguageFilter = null;
                btn.classList.remove("language-filter-btn--active");
            } else {
                // Select new language
                currentLanguageFilter = selectedLang;
                elements.languageFilters.querySelectorAll(".language-filter-btn").forEach(b => {
                    b.classList.remove("language-filter-btn--active");
                });
                btn.classList.add("language-filter-btn--active");
            }
            updateLanguageFilterClearButton();
            applyCourseSearch();
        });
    });
}

function updateLanguageFilterClearButton() {
    if (!elements.languageFilterClear) return;
    if (currentLanguageFilter) {
        elements.languageFilterClear.classList.remove("hidden");
    } else {
        elements.languageFilterClear.classList.add("hidden");
    }
}

function saveCurrentUserToStorage() {
    try {
        if (!currentUser) {
            localStorage.removeItem(USER_STORAGE_KEY);
            return;
        }
        const { password_hash, ...safeUser } = currentUser;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUser));
    } catch (err) {
        console.warn("Không thể lưu user vào localStorage:", err);
    }
}

function loadUserFromStorage() {
    try {
        const raw = localStorage.getItem(USER_STORAGE_KEY);
        if (!raw) return;
        const stored = JSON.parse(raw);
        if (!stored || !stored.id || !stored.username) {
            localStorage.removeItem(USER_STORAGE_KEY);
            return;
        }
        const roles = Array.isArray(stored.roles) ? stored.roles : [];
        currentUser = {
            ...stored,
            roles,
            primary_role: stored.primary_role || (roles.length ? roles[0] : null)
        };
        updateAuthState();
        applyRolePermissions();
        setMessage(null, "");
        setRegisterMessage(null, "");
        setChangePasswordMessage(null, "");
        toggleSection(elements.authPanel, false);
        toggleSection(elements.loginSection, false);
        toggleSection(elements.registerSection, false);
        toggleSection(elements.profileSection, true);
        toggleSection(elements.coursesSection, true);
        toggleSection(elements.courseDetailSection, false);
        toggleSection(elements.progressSection, false);
        toggleSection(elements.forumSection, false);
        toggleSection(elements.forumPostDetailSection, false);
        fetchCourses();
    } catch (err) {
        console.warn("Không thể đọc user từ localStorage:", err);
        localStorage.removeItem(USER_STORAGE_KEY);
    }
}

function updateAuthState() {
    if (currentUser) {
        elements.btnLogout?.classList.remove("hidden");
        elements.btnOpenSettings?.classList.remove("hidden");
        elements.btnCreatePost?.classList.remove("hidden");
        elements.btnLogin?.classList.add("hidden");
        // Hiển thị các section khi đã đăng nhập
        toggleSection(elements.authPanel, false);
    } else {
        elements.btnLogout?.classList.add("hidden");
        elements.btnOpenSettings?.classList.add("hidden");
        elements.btnCreatePost?.classList.add("hidden");
        elements.btnLogin?.classList.remove("hidden");
        // Khi chưa đăng nhập: chỉ hiện tab Khoá học, ẩn panel đăng nhập & các tab khác
        toggleSection(elements.authPanel, false);
        toggleSection(elements.coursesSection, true);
        toggleSection(elements.courseDetailSection, false);
        toggleSection(elements.progressSection, false);
        toggleSection(elements.forumSection, false);
        toggleSection(elements.forumPostDetailSection, false);
        toggleSection(elements.settingsPanel, false);
    }
    updateUserSummary();
    toggleSection(elements.profileSection, false);
    toggleSection(elements.settingsPanel, false);
}

function setRoleHint(text) {
    if (!elements.roleHint) return;
    if (!text) {
        elements.roleHint.classList.add("hidden");
        elements.roleHint.textContent = "";
        return;
    }
    elements.roleHint.textContent = text;
    elements.roleHint.classList.remove("hidden");
}

function getUserRoles() {
    return Array.isArray(currentUser?.roles) ? currentUser.roles : [];
}

function isStudent() {
    return getUserRoles().includes("student");
}

function isInstructor() {
    return getUserRoles().includes("instructor");
}

function applyRolePermissions() {
    const roles = getUserRoles();
    const student = roles.includes("student");
    const instructor = roles.includes("instructor");

    elements.btnViewProgress.disabled = !(student || instructor);
    elements.btnViewProgress.title = currentUser
        ? (student || instructor ? "" : "Chức năng chỉ dành cho học viên hoặc giảng viên")
        : "Đăng nhập để xem tiến độ học tập";

    if (!student && !instructor) {
        toggleSection(elements.progressSection, false);
    }

    if (!currentUser) {
        setRoleHint("");
        return;
    }

    // Hiển thị nút tạo khóa học chỉ cho giảng viên
    if (elements.btnCreateCourse) {
        elements.btnCreateCourse.classList.toggle("hidden", !instructor);
    }

    const roleText = roles.length ? roles.join(", ") : "chưa được cấu hình";
    let actionText = "";
    if (student && instructor) {
        actionText = "Bạn vừa là học viên, vừa là giảng viên.";
    } else if (student) {
        actionText = "Bạn có thể đăng ký và theo dõi tiến độ học.";
    } else if (instructor) {
        actionText = "Bạn là giảng viên, hãy theo dõi tiến độ học viên trong mục Tiến độ.";
    } else {
        actionText = "Bạn hiện chưa được gán vai trò học viên hoặc giảng viên.";
    }
    setRoleHint(`Vai trò: ${roleText}. ${actionText}`);
}

function setActiveAuthTab(tab) {
    const isLogin = tab === "login";
    toggleSection(elements.loginSection, isLogin);
    toggleSection(elements.registerSection, !isLogin);
    elements.authTabLogin?.classList.toggle("auth-tab--active", isLogin);
    elements.authTabRegister?.classList.toggle("auth-tab--active", !isLogin);
    if (isLogin) {
        setRegisterMessage(null, "");
        elements.registerForm?.reset();
    } else {
        setMessage(null, "");
    }
    setChangePasswordMessage(null, "");
}

function setActiveSettingsTab(targetId) {
    if (!elements.settingsPanel) return;

    // Ẩn/hiện các pane trong cài đặt
    const panes = elements.settingsPanel.querySelectorAll(".settings-pane");
    panes.forEach((pane) => {
        pane.classList.toggle("hidden", pane.id !== targetId);
    });

    // Cập nhật trạng thái active cho các nút tab cài đặt
    const buttons = elements.settingsPanel.querySelectorAll(".settings-action");
    buttons.forEach((btn) => {
        const btnTarget = btn.dataset.settingsTarget;
        btn.classList.toggle("settings-action--active", btnTarget === targetId);
    });
}

function updateUserSummary() {
    if (!elements.userSummary) return;
    if (!currentUser) {
        elements.userSummary.classList.add("hidden");
        elements.userName.textContent = "";
        elements.userRoles.textContent = "";
        elements.userAvatar.textContent = "E";
        if (elements.settingsAvatar) elements.settingsAvatar.textContent = "E";
        if (elements.settingsName) elements.settingsName.textContent = "";
        if (elements.settingsRoles) elements.settingsRoles.textContent = "";
        return;
    }
    const initials = (currentUser.full_name || currentUser.username || "E")
        .trim()
        .split(/\s+/)
        .map(part => part[0]?.toUpperCase() || "")
        .join("")
        .slice(0, 2);
    const roles = getUserRoles();

    elements.userSummary.classList.remove("hidden");
    elements.userName.textContent = currentUser.full_name || currentUser.username;
    elements.userRoles.textContent = roles.length
        ? `Vai trò: ${roles.join(", ")}`
        : "Chưa phân quyền";
    elements.userAvatar.textContent = initials || "E";
    if (elements.settingsAvatar) elements.settingsAvatar.textContent = initials || "E";
    if (elements.settingsName) elements.settingsName.textContent = currentUser.full_name || currentUser.username;
    if (elements.settingsRoles) elements.settingsRoles.textContent = roles.length
        ? `Vai trò: ${roles.join(", ")}`
        : "Chưa phân quyền";
}

function handleLogout() {
    currentUser = null;
    saveCurrentUserToStorage();
    elements.loginForm.reset();
    elements.registerForm?.reset();
    setMessage("success", "Đã đăng xuất.");
    setRegisterMessage(null, "");
    setChangePasswordMessage(null, "");
    setRoleHint("");
    setActiveAuthTab("login");
    toggleSection(elements.authPanel, true);
    toggleSection(elements.profileSection, false);
    toggleSection(elements.coursesSection, false);
    toggleSection(elements.courseDetailSection, false);
    toggleSection(elements.progressSection, false);
    toggleSection(elements.forumSection, false);
    toggleSection(elements.forumPostDetailSection, false);
    toggleSection(elements.settingsPanel, false);
    toggleCreateCourseSection(false);
    updateAuthState();
    applyRolePermissions();
    showToast({ title: "Đăng xuất", message: "Bạn đã đăng xuất khỏi hệ thống.", type: "info" });
}

function encodePasswordBase64(plain) {
    try {
        return btoa(unescape(encodeURIComponent(plain)));
    } catch (err) {
        console.error("Encode error", err);
        return null;
    }
}

async function apiRequest(path, options = {}) {
    const fetchOptions = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        cache: options.cache ?? "no-store"
    };
    const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);
    const text = await response.text();
    let payload;
    try {
        payload = text ? JSON.parse(text) : {};
    } catch (err) {
        payload = { raw: text };
    }
    if (!response.ok) {
        const error = new Error(payload.message || "Request failed");
        error.status = response.status;
        error.payload = payload;
        throw error;
    }
    return payload;
}

async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(elements.loginForm);
    const username = formData.get("username").trim();
    const password = formData.get("password");

    if (!username) {
        setMessage("error", "Vui lòng nhập tên đăng nhập.");
        return;
    }

    const passwordHash = encodePasswordBase64(password);
    if (!passwordHash) {
        setMessage("error", "Không thể mã hóa mật khẩu.");
        return;
    }

    try {
        setMessage("success", "Đang xác thực...");
        const user = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password_hash: passwordHash })
        });
        const roles = Array.isArray(user.roles) ? user.roles : [];
        currentUser = {
            ...user,
            password_hash: passwordHash,
            roles,
            primary_role: user.primary_role || (roles.length ? roles[0] : null)
        };
        saveCurrentUserToStorage();
        const roleLabel = roles.length ? roles.join(", ") : "chưa phân quyền";
        setMessage("success", `Xin chào ${user.full_name}! Vai trò: ${roleLabel}.`);
        updateAuthState();
        updateUserSummary();
        applyRolePermissions();
        toggleSection(elements.authPanel, false);
        toggleSection(elements.loginSection, false);
        toggleSection(elements.registerSection, false);
        toggleSection(elements.profileSection, true);
        setRegisterMessage(null, "");
        setChangePasswordMessage(null, "");
        toggleSection(elements.coursesSection, true);
        toggleSection(elements.courseDetailSection, false);
        toggleSection(elements.progressSection, false);
        toggleSection(elements.forumSection, false);
        toggleSection(elements.forumPostDetailSection, false);
        fetchCourses();
        if (isInstructor()) {
            loadProgrammingLanguages();
        }
        showToast({
            title: "Đăng nhập thành công",
            message: `Chào mừng ${user.full_name}!`,
            type: "success"
        });
    } catch (err) {
        console.error(err);
        setMessage("error", err.payload?.error === "INVALID_CREDENTIALS"
            ? "Sai thông tin đăng nhập."
            : "Không thể đăng nhập. Vui lòng thử lại.");
        currentUser = null;
        applyRolePermissions();
        updateAuthState();
        updateUserSummary();
        setRoleHint("");
        toggleSection(elements.authPanel, true);
        toggleSection(elements.profileSection, false);
        toggleSection(elements.coursesSection, false);
        toggleSection(elements.courseDetailSection, false);
        toggleSection(elements.progressSection, false);
        toggleSection(elements.forumSection, false);
        toggleSection(elements.forumPostDetailSection, false);
        setActiveAuthTab("login");
        showToast({
            title: "Đăng nhập thất bại",
            message: err.payload?.error === "INVALID_CREDENTIALS"
                ? "Sai tên đăng nhập hoặc mật khẩu."
                : "Không thể đăng nhập lúc này.",
            type: "error"
        });
    }
}

async function fetchCourses() {
    try {
        const courses = await apiRequest("/courses");
        allCourses = Array.isArray(courses) ? courses : [];
        renderLanguageFilters();
        applyCourseSearch();
    } catch (err) {
        console.error(err);
        elements.coursesList.innerHTML = `<p class="message error">Không thể tải danh sách khóa học.</p>`;
    }
}

function toggleCreateCourseSection(show) {
    if (!elements.courseCreateSection) return;
    const filtersContainer = document.querySelector(".courses-filters");
    const headerSubtitle = document.querySelector(".courses-header .panel__subtitle");
    const headerActions = document.querySelector(".courses-header__actions");

    // Lưu lại subtitle mặc định lần đầu
    if (!toggleCreateCourseSection._defaultSubtitle && headerSubtitle) {
        toggleCreateCourseSection._defaultSubtitle = headerSubtitle.textContent || "";
    }

    elements.courseCreateSection.classList.toggle("hidden", !show);

    if (filtersContainer) {
        filtersContainer.classList.toggle("hidden", show);
    }
    if (elements.coursesList) {
        elements.coursesList.classList.toggle("hidden", show);
    }
    if (headerActions) {
        headerActions.classList.toggle("hidden", show);
    }
    if (headerSubtitle) {
        headerSubtitle.textContent = show
            ? "Giảng viên tạo mới khóa học của riêng mình."
            : (toggleCreateCourseSection._defaultSubtitle || headerSubtitle.textContent);
    }

    if (show) {
        loadProgrammingLanguages();
    }

    if (!show) {
        elements.createCourseForm?.reset();
        setCreateCourseMessage(null, "");
        if (elements.createCourseLanguage) {
            elements.createCourseLanguage.value = "";
        }
    }
}

async function handleCreateCourseSubmit(event) {
    event.preventDefault();
    if (!currentUser || !isInstructor()) {
        setCreateCourseMessage("error", "Chỉ giảng viên mới có thể tạo khóa học.");
        return;
    }
    if (!elements.createCourseForm) return;

    const formData = new FormData(elements.createCourseForm);
    const title = (formData.get("title") || "").toString().trim();
    let languageName = (formData.get("language_name") || "").toString().trim();
    const level = (formData.get("level") || "Beginner").toString();
    const shortDescription = (formData.get("short_description") || "").toString().trim();
    const description = (formData.get("description") || "").toString().trim();
    const priceRaw = formData.get("price_cents");
    const thumbnailUrl = (formData.get("thumbnail_url") || "").toString().trim();
    const isPublished = !!formData.get("is_published");

    let priceCents = 0;
    if (priceRaw !== null && priceRaw !== "") {
        const value = Number(priceRaw);
        if (Number.isNaN(value) || value < 0) {
            setCreateCourseMessage("error", "Học phí không hợp lệ.");
            return;
        }
        priceCents = Math.round(value * 100);
    }

    try {
        if (!title) {
            setCreateCourseMessage("error", "Vui lòng nhập tên khóa học.");
            return;
        }

        if (!languageName) {
            await loadProgrammingLanguages();
            languageName = (formData.get("language_name") || "").toString().trim();
        }

        if (!languageName) {
            setCreateCourseMessage(
                "error",
                "Vui lòng chọn ngôn ngữ lập trình trong danh sách có sẵn."
            );
            return;
        }

        setCreateCourseMessage("success", "Đang tạo khóa học...");
        const payload = await apiRequest(`/instructors/${currentUser.id}/courses`, {
            method: "POST",
            body: JSON.stringify({
                title,
                language_name: languageName,
                level,
                short_description: shortDescription || null,
                description: description || null,
                price_cents: priceCents || 0,
                thumbnail_url: thumbnailUrl || null,
                is_published: isPublished
            })
        });

        // Cập nhật danh sách khóa học trên giao diện
        if (payload && payload.id) {
            allCourses = [payload, ...allCourses];
            renderLanguageFilters();
            applyCourseSearch();
        } else {
            // fallback: tải lại
            await fetchCourses();
        }

        // Hiển thị rõ ràng dòng báo thành công ngay trong màn tạo khóa học
        setCreateCourseMessage("success", `Đã tạo khóa học \"${title}\" thành công.`);
        // Reset form để giảng viên có thể tạo thêm khóa mới
        elements.createCourseForm?.reset();
        showToast({
            title: "Đã tạo khóa học",
            message: `Khóa học "${title}" đã được thêm vào hệ thống.`,
            type: "success"
        });
        // Thêm hộp thoại xác nhận rõ ràng để bạn chắc chắn thấy
        alert(`Đã tạo khóa học \"${title}\" thành công!`);
    } catch (err) {
        console.error(err);
        const message =
            err.payload?.message ||
            err.payload?.error ||
            "Không thể tạo khóa học. Vui lòng thử lại.";
        setCreateCourseMessage("error", message);
        showToast({
            title: "Lỗi tạo khóa học",
            message,
            type: "error"
        });
    }
}

function renderCourseList(courses) {
    if (!Array.isArray(courses) || !courses.length) {
        elements.coursesList.innerHTML = "<p>Chưa có khóa học được xuất bản.</p>";
        return;
    }
    elements.coursesList.innerHTML = courses.map(course => `
        <article class="card">
            <div>
                <span class="badge">${course.level}</span>
            </div>
            <h3>${course.title}</h3>
            <p>${course.short_description || ""}</p>
            <div class="course-meta">
                <span><strong>Ngôn ngữ:</strong> ${course.language_name}</span>
                <span><strong>Giảng viên:</strong> ${course.instructor_name}</span>
                <span><strong>Giá:</strong> ${course.price_cents ? (course.price_cents / 100).toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "Miễn phí"}</span>
            </div>
            <button data-course-slug="${course.slug}" class="link-btn view-course">Xem chi tiết</button>
        </article>
    `).join("");

    elements.coursesList.querySelectorAll(".view-course").forEach(btn => {
        btn.addEventListener("click", () => openCourseDetail(btn.dataset.courseSlug));
    });
}

async function openCourseDetail(slug) {
    try {
        const course = await apiRequest(`/courses/${slug}`);
        renderCourseDetail(course);
        toggleSection(elements.courseDetailSection, true);
    } catch (err) {
        console.error(err);
        elements.courseDetail.innerHTML = `<p class="message error">Không thể tải thông tin khóa học.</p>`;
        toggleSection(elements.courseDetailSection, true);
    }
}

function renderCourseDetail(course) {
    const sectionsHTML = (course.sections || []).map(section => `
        <div class="section-block">
            <h4>${section.title}</h4>
            ${(section.lessons || []).map(lesson => `
                <div class="lesson-item">
                    <strong>${lesson.title}</strong> (${lesson.content_type})
                    ${lesson.duration_sec ? ` - ${Math.round(lesson.duration_sec / 60)} phút` : ""}
                    ${lesson.is_previewable ? ` - <span class="badge">Preview</span>` : ""}
                </div>
            `).join("")}
        </div>
    `).join("");

    const isOwnerInstructor =
        isInstructor() && currentUser && Number(course.instructor_id) === Number(currentUser.id);

    const contentManagerHtml = isOwnerInstructor
        ? renderCourseContentManager(course)
        : "";

    let actionHtml = "";
    if (!currentUser) {
        actionHtml = `<div class="info-box">Đăng nhập để đăng ký và theo dõi khóa học này.</div>`;
    } else if (isStudent()) {
        actionHtml = `
            <div class="course-actions">
                <button data-course-id="${course.id}" class="btn btn--primary enroll-btn">Đăng ký học</button>
            </div>
            <section id="student-course-work" class="student-course-work">
                <header class="student-course-work__header">
                    <div>
                        <h3>Bài tập & Đề thi của bạn</h3>
                        <p class="student-course-work__subtitle">
                            Làm bài tập, tham gia các bài kiểm tra và xem điểm trực tiếp trong khóa học này.
                        </p>
                    </div>
                    <div class="student-tabs" role="tablist">
                        <button
                            type="button"
                            class="student-tab student-tab--active"
                            data-tab="assignments"
                            role="tab"
                        >
                            Bài tập
                        </button>
                        <button
                            type="button"
                            class="student-tab"
                            data-tab="exams"
                            role="tab"
                        >
                            Đề thi
                        </button>
                    </div>
                </header>
                <div id="student-assignments-pane" class="student-pane"></div>
                <div id="student-exams-pane" class="student-pane hidden"></div>
            </section>
        `;
    } else if (isOwnerInstructor) {
        actionHtml = `
            <div class="course-actions course-actions--instructor">
                <div class="info-box">Bạn là giảng viên phụ trách học phần này.</div>
                <button data-course-id="${course.id}" class="btn btn--primary view-course-students">Xem danh sách học viên</button>
            </div>
            <div id="course-students-panel" class="course-students-panel hidden"></div>
            <section id="instructor-tools" class="instructor-tools">
                <header class="instructor-tools__header">
                    <div>
                        <h3>Quản lý giảng dạy</h3>
                        <p class="instructor-tools__subtitle">
                            Tạo và quản lý bài tập, đề thi; theo dõi bài nộp và chấm điểm học viên.
                        </p>
                    </div>
                    <div class="instructor-tabs" role="tablist">
                        <button
                            type="button"
                            class="instructor-tab instructor-tab--active"
                            data-tab="assignments"
                            role="tab"
                        >
                            Bài tập
                        </button>
                        <button
                            type="button"
                            class="instructor-tab"
                            data-tab="exams"
                            role="tab"
                        >
                            Đề thi
                        </button>
                    </div>
                </header>
                <div id="instructor-assignments-pane" class="instructor-pane"></div>
                <div id="instructor-exams-pane" class="instructor-pane hidden"></div>
            </section>
        `;
    } else if (isInstructor()) {
        actionHtml = `<div class="info-box">Bạn là giảng viên, nhưng không phụ trách học phần này.</div>`;
    } else {
        actionHtml = `<div class="info-box">Bạn hiện không có quyền đăng ký khóa học.</div>`;
    }

    elements.courseDetail.innerHTML = `
        <article>
            <h2>${course.title}</h2>
            <p>${course.description || course.short_description || ""}</p>
            <div class="course-meta">
                <span><strong>Ngôn ngữ:</strong> ${course.language_name}</span>
                <span><strong>Giảng viên:</strong> ${course.instructor_name}</span>
                <span><strong>Cấp độ:</strong> ${course.level}</span>
            </div>
            ${sectionsHTML || "<p>Khóa học chưa có nội dung.</p>"}
            ${contentManagerHtml}
            ${actionHtml}
        </article>
    `;

    const enrollBtn = elements.courseDetail.querySelector(".enroll-btn");
    if (enrollBtn) {
        enrollBtn.addEventListener("click", () => enrollCourse(enrollBtn.dataset.courseId));
    }

    const viewStudentsBtn = elements.courseDetail.querySelector(".view-course-students");
    if (viewStudentsBtn) {
        viewStudentsBtn.addEventListener("click", () =>
            loadCourseStudents(viewStudentsBtn.dataset.courseId)
        );
    }

    if (isOwnerInstructor) {
        initInstructorCourseTools(course);
        initCourseContentManager(course);
    }
}

function renderCourseContentManager(course) {
    const sections = Array.isArray(course.sections) ? course.sections : [];
    const sectionsHtml = sections.length
        ? sections.map((section, index) => renderContentManagerSection(section, index)).join("")
        : `<p class="hint">Chưa có chương nào. Hãy tạo chương đầu tiên để bắt đầu xây dựng giáo trình.</p>`;

    return `
        <section id="course-content-manager" class="course-content-manager">
            <header class="course-content-manager__header">
                <div>
                    <h3>Biên tập nội dung khóa học</h3>
                    <p class="course-content-manager__subtitle">
                        Thêm chương mới, bổ sung bài học và sắp xếp thứ tự để học viên dễ dàng theo dõi.
                    </p>
                </div>
                <div class="course-content-manager__actions">
                    <button
                        type="button"
                        id="refresh-course-content"
                        class="btn btn--ghost btn--sm"
                        title="Làm mới từ dữ liệu máy chủ"
                    >
                        ↻ Làm mới nội dung
                    </button>
                </div>
            </header>
            <div class="course-content-manager__grid">
                <div class="course-content-manager__form">
                    <h4>Thêm chương (Section)</h4>
                    <form id="section-create-form" class="form">
                        <label for="section-title-input">Tên chương</label>
                        <input
                            id="section-title-input"
                            name="title"
                            type="text"
                            placeholder="VD: Chương 1 - Làm quen Python"
                            required
                        >
                        <label for="section-position-input">Thứ tự (tùy chọn)</label>
                        <input
                            id="section-position-input"
                            name="position"
                            type="number"
                            min="0"
                            placeholder="VD: 1"
                        >
                        <div class="form-actions">
                            <button type="submit" class="btn btn--primary btn--sm">Thêm chương</button>
                            <button type="reset" class="btn btn--ghost btn--sm">Nhập lại</button>
                        </div>
                    </form>
                    <p id="section-create-message" class="hint"></p>
                </div>
                <div class="course-content-manager__sections" id="course-content-manager-sections">
                    ${sectionsHtml}
                </div>
            </div>
        </section>
    `;
}

function renderContentManagerSection(section, index) {
    const lessons = Array.isArray(section.lessons) ? section.lessons : [];
    const lessonsHtml = lessons.length
        ? `
            <ul class="content-section-card__lessons">
                ${lessons
                    .map(
                        (lesson) => `
                        <li class="lesson-pill">
                            <div>
                                <strong>${escapeHtml(lesson.title || "Bài học")}</strong>
                                <span class="lesson-pill__meta">
                                    ${getLessonTypeLabel(lesson.content_type || DEFAULT_LESSON_TYPE)}
                                    ${formatLessonDuration(lesson)}
                                    ${lesson.is_previewable ? " • Học thử" : ""}
                                </span>
                            </div>
                        </li>
                    `
                    )
                    .join("")}
            </ul>
        `
        : `<p class="hint content-section-card__empty">Chưa có bài học nào trong chương này.</p>`;

    const lessonTypeOptions = LESSON_CONTENT_TYPES.map(
        (type) => `<option value="${type.value}">${type.label}</option>`
    ).join("");

    return `
        <article class="content-section-card" data-section-id="${section.id}">
            <header class="content-section-card__header">
                <div>
                    <p class="content-section-card__eyebrow">Chương ${index + 1}</p>
                    <h4>${escapeHtml(section.title || `Chương ${index + 1}`)}</h4>
                </div>
                <span class="content-section-card__badge">${lessons.length} bài học</span>
            </header>
            ${lessonsHtml}
            <div class="lesson-create-block">
                <h5>Thêm bài học mới</h5>
                <form class="lesson-create-form" data-section-id="${section.id}">
                    <label for="lesson-title-${section.id}">Tiêu đề bài học</label>
                    <input
                        id="lesson-title-${section.id}"
                        name="title"
                        type="text"
                        placeholder="VD: Cấu trúc điều kiện"
                        required
                    >
                    <div class="form-row form-row--inline">
                        <div class="form-row__field">
                            <label for="lesson-type-${section.id}">Loại nội dung</label>
                            <select id="lesson-type-${section.id}" name="content_type">
                                ${lessonTypeOptions}
                            </select>
                        </div>
                        <div class="form-row__field">
                            <label for="lesson-duration-${section.id}">Thời lượng (phút)</label>
                            <input
                                id="lesson-duration-${section.id}"
                                name="duration_minutes"
                                type="number"
                                min="0"
                                step="5"
                                placeholder="VD: 20"
                            >
                        </div>
                    </div>
                    <div class="form-row form-row--inline form-row--align-center">
                        <div class="form-row__field">
                            <label for="lesson-position-${section.id}">Thứ tự (tùy chọn)</label>
                            <input
                                id="lesson-position-${section.id}"
                                name="position"
                                type="number"
                                min="0"
                                placeholder="VD: 2"
                            >
                        </div>
                        <label class="checkbox-label" for="lesson-preview-${section.id}">
                            <input
                                id="lesson-preview-${section.id}"
                                name="is_previewable"
                                type="checkbox"
                            >
                            Cho phép học thử
                        </label>
                    </div>
                    <div class="lesson-create-actions">
                        <button type="submit" class="btn btn--primary btn--sm">Thêm bài học</button>
                    </div>
                </form>
                <p class="hint lesson-create-message" id="lesson-create-message-${section.id}"></p>
            </div>
        </article>
    `;
}

function formatLessonDuration(lesson) {
    if (!lesson || !lesson.duration_sec) return "";
    const totalMinutes = Math.max(1, Math.round(Number(lesson.duration_sec) / 60));
    return ` • ${totalMinutes} phút`;
}

function getLessonTypeLabel(value) {
    const normalized = (value || "").toString().toLowerCase();
    const match = LESSON_CONTENT_TYPES.find((item) => item.value === normalized);
    return match ? match.label : "Nội dung";
}

function initCourseContentManager(course) {
    const sectionForm = document.getElementById("section-create-form");
    if (sectionForm) {
        sectionForm.addEventListener("submit", (event) => handleCreateSection(event, course));
    }

    document.querySelectorAll(".lesson-create-form").forEach((form) => {
        const sectionId = Number(form.dataset.sectionId);
        form.addEventListener("submit", (event) =>
            handleCreateLesson(event, course, sectionId)
        );
    });

    const refreshBtn = document.getElementById("refresh-course-content");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => refreshCourseDetailView(course));
    }
}

async function handleCreateSection(event, course) {
    event.preventDefault();
    if (!currentUser || !isInstructor() || Number(course.instructor_id) !== Number(currentUser.id)) {
        showToast({
            title: "Không có quyền",
            message: "Chỉ giảng viên phụ trách mới có thể tạo chương.",
            type: "error"
        });
        return;
    }

    const form = event.target;
    const fd = new FormData(form);
    const title = (fd.get("title") || "").toString().trim();
    const positionRaw = fd.get("position");
    const messageEl = document.getElementById("section-create-message");

    if (!title) {
        if (messageEl) messageEl.textContent = "Vui lòng nhập tên chương.";
        return;
    }

    let position = null;
    if (positionRaw !== null && positionRaw !== "") {
        const parsed = Number(positionRaw);
        if (Number.isNaN(parsed) || parsed < 0) {
            if (messageEl) messageEl.textContent = "Thứ tự chương phải là số không âm.";
            return;
        }
        position = Math.floor(parsed);
    }

    try {
        if (messageEl) messageEl.textContent = "Đang tạo chương...";
        await apiRequest(`/instructors/${currentUser.id}/courses/${course.id}/sections`, {
            method: "POST",
            body: JSON.stringify({
                title,
                position
            })
        });
        form.reset();
        if (messageEl) messageEl.textContent = "Đã thêm chương mới.";
        showToast({
            title: "Thành công",
            message: `Đã tạo chương "${title}".`,
            type: "success"
        });
        await refreshCourseDetailView(course);
    } catch (err) {
        console.error(err);
        const message =
            err.payload?.message ||
            err.payload?.error ||
            "Không thể tạo chương mới. Vui lòng thử lại.";
        if (messageEl) messageEl.textContent = message;
        showToast({
            title: "Lỗi tạo chương",
            message,
            type: "error"
        });
    }
}

async function handleCreateLesson(event, course, sectionId) {
    event.preventDefault();
    if (!currentUser || !isInstructor() || Number(course.instructor_id) !== Number(currentUser.id)) {
        showToast({
            title: "Không có quyền",
            message: "Chỉ giảng viên phụ trách mới có thể thêm bài học.",
            type: "error"
        });
        return;
    }

    const form = event.target;
    const fd = new FormData(form);
    const title = (fd.get("title") || "").toString().trim();
    const contentTypeRaw = (fd.get("content_type") || "").toString().toLowerCase();
    const durationRaw = fd.get("duration_minutes");
    const positionRaw = fd.get("position");
    const isPreviewable = fd.get("is_previewable") === "on";
    const messageEl = document.getElementById(`lesson-create-message-${sectionId}`);

    if (!title) {
        if (messageEl) messageEl.textContent = "Vui lòng nhập tên bài học.";
        return;
    }

    let durationSec = null;
    if (durationRaw !== null && durationRaw !== "") {
        const minutes = Number(durationRaw);
        if (Number.isNaN(minutes) || minutes < 0) {
            if (messageEl) messageEl.textContent = "Thời lượng phải là số không âm.";
            return;
        }
        durationSec = Math.round(minutes * 60);
    }

    let position = null;
    if (positionRaw !== null && positionRaw !== "") {
        const parsed = Number(positionRaw);
        if (Number.isNaN(parsed) || parsed < 0) {
            if (messageEl) messageEl.textContent = "Thứ tự bài học phải là số không âm.";
            return;
        }
        position = Math.floor(parsed);
    }

    const normalizedType = LESSON_CONTENT_TYPES.some((item) => item.value === contentTypeRaw)
        ? contentTypeRaw
        : DEFAULT_LESSON_TYPE;

    try {
        if (messageEl) messageEl.textContent = "Đang tạo bài học...";
        await apiRequest(
            `/instructors/${currentUser.id}/courses/${course.id}/sections/${sectionId}/lessons`,
            {
                method: "POST",
                body: JSON.stringify({
                    title,
                    content_type: normalizedType,
                    duration_sec: durationSec,
                    position,
                    is_previewable: isPreviewable
                })
            }
        );
        form.reset();
        if (messageEl) messageEl.textContent = "Đã thêm bài học mới.";
        showToast({
            title: "Thành công",
            message: `Đã tạo bài học "${title}".`,
            type: "success"
        });
        await refreshCourseDetailView(course);
    } catch (err) {
        console.error(err);
        const message =
            err.payload?.message ||
            err.payload?.error ||
            "Không thể tạo bài học mới. Vui lòng thử lại.";
        if (messageEl) messageEl.textContent = message;
        showToast({
            title: "Lỗi tạo bài học",
            message,
            type: "error"
        });
    }
}

async function refreshCourseDetailView(course) {
    if (course && course.slug) {
        await openCourseDetail(course.slug);
        return;
    }
    showToast({
        title: "Cần mở lại khóa học",
        message: "Không tìm thấy slug khóa học. Vui lòng đóng và mở lại chi tiết.",
        type: "info"
    });
}

async function loadCourseStudents(courseId) {
    const panel = document.getElementById("course-students-panel");
    if (!panel) return;
    panel.classList.remove("hidden");
    panel.innerHTML = `<p class="hint">Đang tải danh sách học viên...</p>`;
    try {
        const students = await apiRequest(`/courses/${courseId}/students`);
        renderCourseStudents(panel, students);
    } catch (err) {
        console.error(err);
        panel.innerHTML = `<p class="message error">Không thể tải danh sách học viên.</p>`;
    }
}

function renderCourseStudents(panel, students) {
    if (!Array.isArray(students) || !students.length) {
        panel.innerHTML = `<p class="hint">Chưa có học viên nào đăng ký học phần này.</p>`;
        return;
    }

    const itemsHtml = students
        .map((s) => {
            const name = s.student_name || s.student_email || "Học viên";
            const initials = (name || "S")
                .trim()
                .split(/\s+/)
                .map((part) => part[0]?.toUpperCase() || "")
                .join("")
                .slice(0, 2);
            const progress = typeof s.progress_percent === "number" ? s.progress_percent : 0;
            const lastAccess = s.last_access_at
                ? new Date(s.last_access_at).toLocaleDateString("vi-VN")
                : "Chưa có";

            return `
            <div class="course-student-item">
                <div class="course-student-item__main">
                    <div class="course-student-item__avatar">${escapeHtml(initials)}</div>
                    <div class="course-student-item__info">
                        <div class="course-student-item__name">${escapeHtml(name)}</div>
                        <div class="course-student-item__meta">
                            <span>Tiến độ: ${progress}%</span>
                            <span> • Lần truy cập cuối: ${lastAccess}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
        })
        .join("");

    panel.innerHTML = `
        <h3 class="course-students-title">Học viên đang tham gia</h3>
        <div class="course-students-list">
            ${itemsHtml}
        </div>
    `;
}

async function enrollCourse(courseId) {
    if (!currentUser) {
        alert("Bạn cần đăng nhập để đăng ký khóa học.");
        return;
    }
    if (!isStudent()) {
        alert("Chỉ học viên mới có thể đăng ký khóa học.");
        return;
    }
    try {
        await apiRequest(`/courses/${courseId}/enroll`, {
            method: "POST",
            body: JSON.stringify({ user_id: currentUser.id })
        });
        alert("Đăng ký thành công!");
    } catch (err) {
        console.error(err);
        alert("Không thể đăng ký. Vui lòng thử lại.");
    }
}

// ============================================================================
// Student course work: assignments & exams
// ============================================================================

function initStudentCourseWork(course) {
    const container = document.getElementById("student-course-work");
    if (!container || !currentUser || !isStudent()) return;

    const tabs = Array.from(container.querySelectorAll(".student-tab"));
    const paneAssignments = document.getElementById("student-assignments-pane");
    const paneExams = document.getElementById("student-exams-pane");

    function setActiveTab(tabName) {
        tabs.forEach((btn) => {
            const isActive = btn.dataset.tab === tabName;
            btn.classList.toggle("student-tab--active", isActive);
        });
        if (paneAssignments) {
            paneAssignments.classList.toggle("hidden", tabName !== "assignments");
        }
        if (paneExams) {
            paneExams.classList.toggle("hidden", tabName !== "exams");
        }
    }

    tabs.forEach((btn) => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            setActiveTab(tab);
        });
    });

    // Tải dữ liệu ban đầu
    loadStudentCourseAssignments(course);
    loadStudentCourseExams(course);
}

async function loadStudentCourseAssignments(course) {
    const pane = document.getElementById("student-assignments-pane");
    if (!pane) return;
    if (!currentUser || !isStudent()) {
        pane.innerHTML = `<p class="hint">Chỉ học viên mới xem được danh sách bài tập.</p>`;
        return;
    }
    pane.innerHTML = `<p class="hint">Đang tải danh sách bài tập...</p>`;
    try {
        const assignments = await apiRequest(
            `/students/${currentUser.id}/courses/${course.id}/assignments`
        );
        renderStudentAssignmentsPane(
            course,
            Array.isArray(assignments) ? assignments : []
        );
    } catch (err) {
        console.error(err);
        pane.innerHTML = `<p class="message error">Không thể tải danh sách bài tập.</p>`;
    }
}

function renderStudentAssignmentsPane(course, assignments) {
    const pane = document.getElementById("student-assignments-pane");
    if (!pane) return;

    if (!assignments.length) {
        pane.innerHTML = `<p class="hint">Chưa có bài tập nào được giao cho khóa học này.</p>`;
        return;
    }

    const itemsHtml = assignments
        .map((a) => {
            const due =
                a.due_at && a.due_at !== "null"
                    ? new Date(a.due_at).toLocaleString("vi-VN")
                    : "Không giới hạn";
            const statusLabel =
                a.status === "graded"
                    ? "Đã chấm"
                    : a.status === "submitted"
                    ? "Đã nộp"
                    : "Chưa nộp";
            const scoreText =
                a.score !== null && a.score !== undefined
                    ? `${Number(a.score)} / ${Number(a.max_score || 10)}`
                    : "-";
            const feedbackText = a.feedback || "";

            return `
            <article class="student-item">
                <div class="student-item__main">
                    <h4>${escapeHtml(a.title)}</h4>
                    <p class="student-item__meta">
                        <span>Điểm tối đa: ${Number(a.max_score || 10)}</span>
                        <span>• Hạn nộp: ${due}</span>
                    </p>
                </div>
                <div class="student-item__status-row">
                    <span class="student-status student-status--${a.status || "not_submitted"}">
                        ${statusLabel}
                    </span>
                    <span class="student-score-label">Điểm: ${scoreText}</span>
                </div>
                ${
                    feedbackText
                        ? `<p class="student-feedback"><strong>Nhận xét:</strong> ${escapeHtml(
                              feedbackText
                          )}</p>`
                        : ""
                }
                <div class="student-item__actions">
                    <button
                        type="button"
                        class="btn btn--ghost btn--sm student-submit-assignment-btn"
                        data-assignment-id="${a.id}"
                        data-course-id="${course.id}"
                    >
                        ${a.status === "submitted" || a.status === "graded" ? "Sửa bài nộp" : "Nộp bài"}
                    </button>
                </div>
            </article>
        `;
        })
        .join("");

    pane.innerHTML = `
        <div class="student-list">
            ${itemsHtml}
        </div>
    `;

    pane.querySelectorAll(".student-submit-assignment-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const assignmentId = Number(btn.dataset.assignmentId);
            handleSubmitAssignment(assignmentId, course.id);
        });
    });
}

async function handleSubmitAssignment(assignmentId, courseId) {
    if (!currentUser || !isStudent()) return;

    const content = window.prompt(
        "Nhập nội dung bài làm (hoặc mô tả, link GitHub, v.v.):",
        ""
    );
    if (content === null) return;
    const trimmedContent = content.trim();
    if (!trimmedContent) {
        alert("Vui lòng nhập nội dung bài làm.");
        return;
    }

    const url = window.prompt(
        "Nhập link tài liệu / GitHub (có thể bỏ qua):",
        ""
    );

    try {
        await apiRequest(
            `/students/${currentUser.id}/assignments/${assignmentId}/submit`,
            {
                method: "POST",
                body: JSON.stringify({
                    content_text: trimmedContent,
                    content_url: url && url.trim() ? url.trim() : null
                })
            }
        );
        showToast({
            title: "Đã nộp bài",
            message: "Bài tập của bạn đã được gửi cho giảng viên.",
            type: "success"
        });
        // Tải lại danh sách bài tập
        loadStudentCourseAssignments({ id: courseId });
    } catch (err) {
        console.error(err);
        alert("Không thể nộp bài. Vui lòng thử lại.");
    }
}

async function loadStudentCourseExams(course) {
    const pane = document.getElementById("student-exams-pane");
    if (!pane) return;
    if (!currentUser || !isStudent()) {
        pane.innerHTML = `<p class="hint">Chỉ học viên mới xem được danh sách đề thi.</p>`;
        return;
    }
    pane.innerHTML = `<p class="hint">Đang tải danh sách đề thi...</p>`;
    try {
        const exams = await apiRequest(
            `/students/${currentUser.id}/courses/${course.id}/exams`
        );
        renderStudentExamsPane(
            course,
            Array.isArray(exams) ? exams : []
        );
    } catch (err) {
        console.error(err);
        pane.innerHTML = `<p class="message error">Không thể tải danh sách đề thi.</p>`;
    }
}

function renderStudentExamsPane(course, exams) {
    const pane = document.getElementById("student-exams-pane");
    if (!pane) return;

    if (!exams.length) {
        pane.innerHTML = `<p class="hint">Chưa có đề thi nào được mở cho khóa học này.</p>`;
        return;
    }

    const itemsHtml = exams
        .map((e) => {
            const start =
                e.start_at && e.start_at !== "null"
                    ? new Date(e.start_at).toLocaleString("vi-VN")
                    : "Không giới hạn";
            const end =
                e.end_at && e.end_at !== "null"
                    ? new Date(e.end_at).toLocaleString("vi-VN")
                    : "Không giới hạn";
            const status =
                e.submission_status ||
                (e.submission_id ? "submitted" : "not_submitted");
            const statusLabel =
                status === "graded"
                    ? "Đã chấm"
                    : status === "submitted"
                    ? "Đã nộp"
                    : "Chưa làm";
            const scoreText =
                e.total_score !== null && e.total_score !== undefined
                    ? `${Number(e.total_score)} / ${Number(e.max_score || 10)}`
                    : "-";

            return `
            <article class="student-item">
                <div class="student-item__main">
                    <h4>${escapeHtml(e.title)}</h4>
                    <p class="student-item__meta">
                        <span>Điểm tối đa: ${Number(e.max_score || 10)}</span>
                        <span>• Thời lượng: ${e.duration_minutes || 0} phút</span>
                        <span>• Từ: ${start}</span>
                        <span>• Đến: ${end}</span>
                    </p>
                </div>
                <div class="student-item__status-row">
                    <span class="student-status student-status--${status}">
                        ${statusLabel}
                    </span>
                    <span class="student-score-label">Điểm: ${scoreText}</span>
                </div>
                <div class="student-item__actions">
                    <button
                        type="button"
                        class="btn btn--primary btn--sm student-submit-exam-btn"
                        data-exam-id="${e.id}"
                        data-course-id="${course.id}"
                        ${status === "graded" ? "disabled" : ""}
                    >
                        ${status === "submitted" || status === "graded" ? "Làm lại / gửi lại" : "Làm bài thi"}
                    </button>
                </div>
            </article>
        `;
        })
        .join("");

    pane.innerHTML = `
        <div class="student-list">
            ${itemsHtml}
        </div>
    `;

    pane.querySelectorAll(".student-submit-exam-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const examId = Number(btn.dataset.examId);
            const courseId = Number(btn.dataset.courseId);
            handleSubmitExam(examId, courseId);
        });
    });
}

async function handleSubmitExam(examId, courseId) {
    if (!currentUser || !isStudent()) return;

    const confirmDo = window.confirm(
        "Bạn xác nhận nộp bài thi này? (Phiên bản demo: hệ thống chỉ ghi nhận bạn đã tham gia để giảng viên chấm điểm sau.)"
    );
    if (!confirmDo) return;

    try {
        await apiRequest(`/exams/${examId}/submit`, {
            method: "POST",
            body: JSON.stringify({
                exam_id: examId,
                student_id: currentUser.id,
                enrollment_id: null
            })
        });
        showToast({
            title: "Đã ghi nhận",
            message: "Bài thi của bạn đã được gửi.",
            type: "success"
        });
        loadStudentCourseExams({ id: courseId });
    } catch (err) {
        console.error(err);
        alert("Không thể gửi bài thi. Vui lòng thử lại.");
    }
}

// ============================================================================
// Instructor tools: assignments & exams
// ============================================================================

function initInstructorCourseTools(course) {
    const tools = document.getElementById("instructor-tools");
    if (!tools || !currentUser || !isInstructor()) return;

    const tabs = Array.from(tools.querySelectorAll(".instructor-tab"));
    const paneAssignments = document.getElementById("instructor-assignments-pane");
    const paneExams = document.getElementById("instructor-exams-pane");

    function setActiveTab(tabName) {
        tabs.forEach((btn) => {
            const isActive = btn.dataset.tab === tabName;
            btn.classList.toggle("instructor-tab--active", isActive);
        });
        if (paneAssignments) {
            paneAssignments.classList.toggle("hidden", tabName !== "assignments");
        }
        if (paneExams) {
            paneExams.classList.toggle("hidden", tabName !== "exams");
        }
    }

    tabs.forEach((btn) => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            setActiveTab(tab);
        });
    });

    // Tải dữ liệu ban đầu
    loadCourseAssignments(course);
    loadCourseExams(course);
}

async function loadCourseAssignments(course) {
    const pane = document.getElementById("instructor-assignments-pane");
    if (!pane) return;
    if (!currentUser || !isInstructor()) {
        pane.innerHTML = `<p class="hint">Chỉ giảng viên mới xem được danh sách bài tập.</p>`;
        return;
    }
    pane.innerHTML = `<p class="hint">Đang tải danh sách bài tập...</p>`;
    try {
        const assignments = await apiRequest(
            `/instructors/${currentUser.id}/courses/${course.id}/assignments`
        );
        renderInstructorAssignmentsPane(course, Array.isArray(assignments) ? assignments : []);
    } catch (err) {
        console.error(err);
        pane.innerHTML = `<p class="message error">Không thể tải danh sách bài tập.</p>`;
    }
}

function renderInstructorAssignmentsPane(course, assignments) {
    const pane = document.getElementById("instructor-assignments-pane");
    if (!pane) return;

    const listHtml = !assignments.length
        ? `<p class="hint">Chưa có bài tập nào cho học phần này.</p>`
        : `
        <div class="instructor-list">
            ${assignments
                .map((a) => {
                    const due =
                        a.due_at && a.due_at !== "null"
                            ? new Date(a.due_at).toLocaleString("vi-VN")
                            : "Không giới hạn";
                    const published = a.is_published ? "Đã giao" : "Nháp";
                    return `
                <article class="instructor-item">
                    <div class="instructor-item__main">
                        <h4>${escapeHtml(a.title)}</h4>
                        <p class="instructor-item__meta">
                            <span>Điểm tối đa: ${Number(a.max_score || 10)}</span>
                            <span>• Hạn nộp: ${due}</span>
                            <span>• Trạng thái: ${published}</span>
                        </p>
                    </div>
                    <div class="instructor-item__actions">
                        <button
                            type="button"
                            class="btn btn--ghost btn--sm"
                            data-assignment-id="${a.id}"
                            data-course-id="${course.id}"
                            data-action="view-submissions"
                        >
                            Xem bài nộp
                        </button>
                    </div>
                    <div id="assignment-submissions-${a.id}" class="assignment-submissions hidden"></div>
                </article>
                `;
                })
                .join("")}
        </div>
    `;

    pane.innerHTML = `
        <div class="instructor-pane__intro">
            <p class="hint">
                Bài tập giúp củng cố kiến thức sau mỗi chương. Bạn có thể tạo nhanh bài tập,
                xem bài nộp và chấm điểm trực tiếp tại đây.
            </p>
        </div>
        <section class="instructor-form-block">
            <h4>Tạo bài tập mới</h4>
            <form id="assignment-create-form" class="form form--inline">
                <div class="form-row">
                    <label for="assignment-title">Tiêu đề</label>
                    <input id="assignment-title" name="title" type="text" required placeholder="VD: Bài tập 1 - Cấu trúc điều khiển">
                </div>
                <div class="form-row form-row--inline">
                    <div class="form-row__field">
                        <label for="assignment-max-score">Điểm tối đa</label>
                        <input id="assignment-max-score" name="max_score" type="number" step="0.5" min="1" value="10">
                    </div>
                    <div class="form-row__field">
                        <label for="assignment-due-at">Hạn nộp</label>
                        <input id="assignment-due-at" name="due_at" type="datetime-local">
                    </div>
                </div>
                <div class="form-row form-row--inline form-row--align-center">
                    <label class="checkbox-label">
                        <input id="assignment-is-published" name="is_published" type="checkbox" checked>
                        Giao ngay cho học viên
                    </label>
                    <button type="submit" class="btn btn--primary btn--sm">Tạo bài tập</button>
                </div>
                <p id="assignment-create-message" class="hint"></p>
            </form>
        </section>
        <section class="instructor-list-block">
            <h4>Bài tập hiện có</h4>
            ${listHtml}
        </section>
    `;

    const form = document.getElementById("assignment-create-form");
    if (form) {
        form.addEventListener("submit", (e) =>
            handleCreateAssignment(e, course.id)
        );
    }

    pane.querySelectorAll("[data-action='view-submissions']").forEach((btn) => {
        btn.addEventListener("click", () => {
            const assignmentId = Number(btn.dataset.assignmentId);
            loadAssignmentSubmissions(assignmentId);
        });
    });
}

async function handleCreateAssignment(event, courseId) {
    event.preventDefault();
    if (!currentUser || !isInstructor()) return;
    const form = event.target;
    const msgEl = document.getElementById("assignment-create-message");
    const fd = new FormData(form);
    const title = (fd.get("title") || "").toString().trim();
    const maxScoreRaw = fd.get("max_score");
    const dueAtRaw = fd.get("due_at");
    const isPublished = fd.get("is_published") === "on";

    if (!title) {
        if (msgEl) msgEl.textContent = "Vui lòng nhập tiêu đề bài tập.";
        return;
    }

    const maxScore = maxScoreRaw ? Number(maxScoreRaw) : 10;
    const body = {
        title,
        description: null,
        max_score: maxScore,
        due_at: dueAtRaw || null,
        is_published: isPublished,
        lesson_id: null
    };

    if (msgEl) msgEl.textContent = "Đang tạo bài tập...";

    try {
        await apiRequest(
            `/instructors/${currentUser.id}/courses/${courseId}/assignments`,
            {
                method: "POST",
                body: JSON.stringify(body)
            }
        );
        if (msgEl) msgEl.textContent = "Đã tạo bài tập mới.";
        form.reset();
        // Mặc định lại giao ngay
        const publishedCheckbox = document.getElementById("assignment-is-published");
        if (publishedCheckbox) publishedCheckbox.checked = true;
        loadCourseAssignments({ id: courseId });
        showToast({
            title: "Thành công",
            message: "Bài tập đã được tạo.",
            type: "success"
        });
    } catch (err) {
        console.error(err);
        if (msgEl) {
            msgEl.textContent =
                err.payload?.message || "Không thể tạo bài tập. Vui lòng thử lại.";
        }
        showToast({
            title: "Lỗi",
            message: "Không thể tạo bài tập.",
            type: "error"
        });
    }
}

async function loadAssignmentSubmissions(assignmentId) {
    if (!currentUser || !isInstructor()) return;
    const container = document.getElementById(`assignment-submissions-${assignmentId}`);
    if (!container) return;
    container.classList.remove("hidden");
    container.innerHTML = `<p class="hint">Đang tải danh sách bài nộp...</p>`;
    try {
        const submissions = await apiRequest(
            `/instructors/${currentUser.id}/assignments/${assignmentId}/submissions`
        );
        renderAssignmentSubmissions(
            assignmentId,
            Array.isArray(submissions) ? submissions : [],
            container
        );
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="message error">Không thể tải danh sách bài nộp.</p>`;
    }
}

function renderAssignmentSubmissions(assignmentId, submissions, container) {
    if (!submissions.length) {
        container.innerHTML = `<p class="hint">Chưa có học viên nộp bài.</p>`;
        return;
    }

    const rows = submissions
        .map((s) => {
            const score =
                s.score !== null && s.score !== undefined ? Number(s.score) : null;
            const statusLabel =
                s.status === "graded"
                    ? "Đã chấm"
                    : s.status === "submitted"
                    ? "Đã nộp"
                    : "Nháp";
            return `
            <tr>
                <td>${escapeHtml(s.student_name || s.student_email || String(s.student_id))}</td>
                <td>${s.submitted_at ? formatDate(s.submitted_at) : "Chưa nộp"}</td>
                <td>${statusLabel}</td>
                <td>${score !== null ? score : "-"}</td>
                <td>${escapeHtml(s.feedback || "")}</td>
                <td>
                    <button
                        type="button"
                        class="btn btn--ghost btn--sm grade-assignment-btn"
                        data-assignment-id="${assignmentId}"
                        data-student-id="${s.student_id}"
                        data-current-score="${score !== null ? score : ""}"
                        data-current-feedback="${escapeHtml(s.feedback || "")}"
                    >
                        Chấm / sửa điểm
                    </button>
                </td>
            </tr>
        `;
        })
        .join("");

    container.innerHTML = `
        <div class="instructor-submissions">
            <h5>Danh sách bài nộp</h5>
            <div class="table-wrapper">
                <table class="instructor-table">
                    <thead>
                        <tr>
                            <th>Học viên</th>
                            <th>Thời gian nộp</th>
                            <th>Trạng thái</th>
                            <th>Điểm</th>
                            <th>Nhận xét</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.querySelectorAll(".grade-assignment-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const studentId = Number(btn.dataset.studentId);
            const currentScore = btn.dataset.currentScore || "";
            const currentFeedback = btn.dataset.currentFeedback || "";
            handleGradeAssignment(assignmentId, studentId, currentScore, currentFeedback);
        });
    });
}

async function handleGradeAssignment(
    assignmentId,
    studentId,
    currentScore,
    currentFeedback
) {
    if (!currentUser || !isInstructor()) return;

    const scoreInput = window.prompt(
        "Nhập điểm cho học viên:",
        currentScore || ""
    );
    if (scoreInput === null) return;
    const score = Number(scoreInput);
    if (Number.isNaN(score)) {
        alert("Điểm không hợp lệ.");
        return;
    }
    const feedback =
        window.prompt("Nhận xét (không bắt buộc):", currentFeedback || "") || "";

    try {
        await apiRequest(
            `/instructors/${currentUser.id}/assignments/${assignmentId}/grade`,
            {
                method: "POST",
                body: JSON.stringify({
                    student_id: studentId,
                    score,
                    feedback
                })
            }
        );
        showToast({
            title: "Đã chấm điểm",
            message: "Điểm và nhận xét đã được lưu.",
            type: "success"
        });
        loadAssignmentSubmissions(assignmentId);
    } catch (err) {
        console.error(err);
        alert("Không thể chấm điểm. Vui lòng thử lại.");
    }
}

async function loadCourseExams(course) {
    const pane = document.getElementById("instructor-exams-pane");
    if (!pane) return;
    if (!currentUser || !isInstructor()) {
        pane.innerHTML = `<p class="hint">Chỉ giảng viên mới xem được danh sách đề thi.</p>`;
        return;
    }
    pane.innerHTML = `<p class="hint">Đang tải danh sách đề thi...</p>`;
    try {
        const exams = await apiRequest(
            `/instructors/${currentUser.id}/courses/${course.id}/exams`
        );
        renderInstructorExamsPane(course, Array.isArray(exams) ? exams : []);
    } catch (err) {
        console.error(err);
        pane.innerHTML = `<p class="message error">Không thể tải danh sách đề thi.</p>`;
    }
}

function renderInstructorExamsPane(course, exams) {
    const pane = document.getElementById("instructor-exams-pane");
    if (!pane) return;

    const listHtml = !exams.length
        ? `<p class="hint">Chưa có đề thi nào cho học phần này.</p>`
        : `
        <div class="instructor-list">
            ${exams
                .map((e) => {
                    const start =
                        e.start_at && e.start_at !== "null"
                            ? new Date(e.start_at).toLocaleString("vi-VN")
                            : "Không giới hạn";
                    const end =
                        e.end_at && e.end_at !== "null"
                            ? new Date(e.end_at).toLocaleString("vi-VN")
                            : "Không giới hạn";
                    const published = e.is_published ? "Đã mở" : "Nháp";
                    return `
                <article class="instructor-item">
                    <div class="instructor-item__main">
                        <h4>${escapeHtml(e.title)}</h4>
                        <p class="instructor-item__meta">
                            <span>Điểm tối đa: ${Number(e.max_score || 10)}</span>
                            <span>• Thời lượng: ${e.duration_minutes || 0} phút</span>
                            <span>• Bắt đầu: ${start}</span>
                            <span>• Kết thúc: ${end}</span>
                            <span>• Trạng thái: ${published}</span>
                        </p>
                    </div>
                    <div class="instructor-item__actions">
                        <button
                            type="button"
                            class="btn btn--ghost btn--sm"
                            data-exam-id="${e.id}"
                            data-action="view-exam-submissions"
                        >
                            Xem bài làm
                        </button>
                    </div>
                    <div id="exam-submissions-${e.id}" class="assignment-submissions hidden"></div>
                </article>
                `;
                })
                .join("")}
        </div>
    `;

    pane.innerHTML = `
        <div class="instructor-pane__intro">
            <p class="hint">
                Đề thi được dùng cho các bài kiểm tra lớn (quiz, giữa kỳ, cuối kỳ).
                Bạn có thể tạo đề thi và theo dõi bài làm, chấm điểm thủ công từ đây.
            </p>
        </div>
        <section class="instructor-form-block">
            <h4>Tạo đề thi mới</h4>
            <form id="exam-create-form" class="form form--inline">
                <div class="form-row">
                    <label for="exam-title">Tiêu đề</label>
                    <input id="exam-title" name="title" type="text" required placeholder="VD: Quiz 1 - Python cơ bản">
                </div>
                <div class="form-row">
                    <label for="exam-description">Mô tả (không bắt buộc)</label>
                    <input id="exam-description" name="description" type="text" placeholder="VD: Kiểm tra chương 1–2">
                </div>
                <div class="form-row form-row--inline">
                    <div class="form-row__field">
                        <label for="exam-max-score">Điểm tối đa</label>
                        <input id="exam-max-score" name="max_score" type="number" step="0.5" min="1" value="10">
                    </div>
                    <div class="form-row__field">
                        <label for="exam-duration">Thời lượng (phút)</label>
                        <input id="exam-duration" name="duration_minutes" type="number" min="0" value="20">
                    </div>
                </div>
                <div class="form-row form-row--inline">
                    <div class="form-row__field">
                        <label for="exam-start-at">Bắt đầu</label>
                        <input id="exam-start-at" name="start_at" type="datetime-local">
                    </div>
                    <div class="form-row__field">
                        <label for="exam-end-at">Kết thúc</label>
                        <input id="exam-end-at" name="end_at" type="datetime-local">
                    </div>
                </div>
                <div class="form-row form-row--inline form-row--align-center">
                    <label class="checkbox-label">
                        <input id="exam-is-published" name="is_published" type="checkbox" checked>
                        Mở ngay cho học viên
                    </label>
                    <button type="submit" class="btn btn--primary btn--sm">Tạo đề thi</button>
                </div>
                <p id="exam-create-message" class="hint"></p>
            </form>
        </section>
        <section class="instructor-list-block">
            <h4>Đề thi hiện có</h4>
            ${listHtml}
        </section>
    `;

    const form = document.getElementById("exam-create-form");
    if (form) {
        form.addEventListener("submit", (e) =>
            handleCreateExam(e, course.id)
        );
    }

    pane.querySelectorAll("[data-action='view-exam-submissions']").forEach((btn) => {
        btn.addEventListener("click", () => {
            const examId = Number(btn.dataset.examId);
            loadExamSubmissions(examId);
        });
    });
}

async function handleCreateExam(event, courseId) {
    event.preventDefault();
    if (!currentUser || !isInstructor()) return;
    const form = event.target;
    const msgEl = document.getElementById("exam-create-message");
    const fd = new FormData(form);
    const title = (fd.get("title") || "").toString().trim();
    const description = (fd.get("description") || "").toString().trim() || null;
    const maxScoreRaw = fd.get("max_score");
    const durationRaw = fd.get("duration_minutes");
    const startAtRaw = fd.get("start_at");
    const endAtRaw = fd.get("end_at");
    const isPublished = fd.get("is_published") === "on";

    if (!title) {
        if (msgEl) msgEl.textContent = "Vui lòng nhập tiêu đề đề thi.";
        return;
    }

    const maxScore = maxScoreRaw ? Number(maxScoreRaw) : 10;
    const duration = durationRaw ? Number(durationRaw) : null;

    const body = {
        title,
        description,
        max_score: maxScore,
        duration_minutes: duration,
        start_at: startAtRaw || null,
        end_at: endAtRaw || null,
        attempt_limit: 1,
        is_published: isPublished
    };

    if (msgEl) msgEl.textContent = "Đang tạo đề thi...";

    try {
        await apiRequest(
            `/instructors/${currentUser.id}/courses/${courseId}/exams`,
            {
                method: "POST",
                body: JSON.stringify(body)
            }
        );
        if (msgEl) msgEl.textContent = "Đã tạo đề thi mới.";
        form.reset();
        const publishedCheckbox = document.getElementById("exam-is-published");
        if (publishedCheckbox) publishedCheckbox.checked = true;
        loadCourseExams({ id: courseId });
        showToast({
            title: "Thành công",
            message: "Đề thi đã được tạo.",
            type: "success"
        });
    } catch (err) {
        console.error(err);
        if (msgEl) {
            msgEl.textContent =
                err.payload?.message || "Không thể tạo đề thi. Vui lòng thử lại.";
        }
        showToast({
            title: "Lỗi",
            message: "Không thể tạo đề thi.",
            type: "error"
        });
    }
}

async function loadExamSubmissions(examId) {
    if (!currentUser || !isInstructor()) return;
    const container = document.getElementById(`exam-submissions-${examId}`);
    if (!container) return;
    container.classList.remove("hidden");
    container.innerHTML = `<p class="hint">Đang tải danh sách bài làm...</p>`;
    try {
        const submissions = await apiRequest(
            `/instructors/${currentUser.id}/exams/${examId}/submissions`
        );
        renderExamSubmissions(
            examId,
            Array.isArray(submissions) ? submissions : [],
            container
        );
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="message error">Không thể tải danh sách bài làm.</p>`;
    }
}

function renderExamSubmissions(examId, submissions, container) {
    if (!submissions.length) {
        container.innerHTML = `<p class="hint">Chưa có học viên làm đề thi này.</p>`;
        return;
    }

    const rows = submissions
        .map((s) => {
            const score =
                s.total_score !== null && s.total_score !== undefined
                    ? Number(s.total_score)
                    : null;
            const statusLabel =
                s.status === "graded"
                    ? "Đã chấm"
                    : s.status === "submitted"
                    ? "Đã nộp"
                    : "Đang làm";
            return `
            <tr>
                <td>${escapeHtml(s.student_name || s.student_email || String(s.student_id))}</td>
                <td>${s.submitted_at ? formatDate(s.submitted_at) : "Chưa nộp"}</td>
                <td>${statusLabel}</td>
                <td>${score !== null ? score : "-"}</td>
                <td>
                    <button
                        type="button"
                        class="btn btn--ghost btn--sm grade-exam-btn"
                        data-exam-id="${examId}"
                        data-submission-id="${s.id}"
                        data-current-score="${score !== null ? score : ""}"
                    >
                        Chấm / sửa điểm
                    </button>
                </td>
            </tr>
        `;
        })
        .join("");

    container.innerHTML = `
        <div class="instructor-submissions">
            <h5>Danh sách bài làm</h5>
            <div class="table-wrapper">
                <table class="instructor-table">
                    <thead>
                        <tr>
                            <th>Học viên</th>
                            <th>Thời gian nộp</th>
                            <th>Trạng thái</th>
                            <th>Điểm</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.querySelectorAll(".grade-exam-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const submissionId = Number(btn.dataset.submissionId);
            const currentScore = btn.dataset.currentScore || "";
            handleGradeExam(examId, submissionId, currentScore);
        });
    });
}

async function handleGradeExam(examId, submissionId, currentScore) {
    if (!currentUser || !isInstructor()) return;

    const scoreInput = window.prompt(
        "Nhập tổng điểm cho bài làm:",
        currentScore || ""
    );
    if (scoreInput === null) return;
    const score = Number(scoreInput);
    if (Number.isNaN(score)) {
        alert("Điểm không hợp lệ.");
        return;
    }

    try {
        await apiRequest(
            `/instructors/${currentUser.id}/exams/${examId}/grade`,
            {
                method: "POST",
                body: JSON.stringify({
                    submission_id: submissionId,
                    total_score: score
                })
            }
        );
        showToast({
            title: "Đã chấm điểm",
            message: "Điểm bài làm đã được lưu.",
            type: "success"
        });
        loadExamSubmissions(examId);
    } catch (err) {
        console.error(err);
        alert("Không thể chấm điểm bài thi. Vui lòng thử lại.");
    }
}

async function startCourseChat(course) {
    if (!currentUser) {
        showToast({
            title: "Yêu cầu đăng nhập",
            message: "Vui lòng đăng nhập để chat với giảng viên.",
            type: "info"
        });
        return;
    }
    if (!isStudent()) {
        showToast({
            title: "Không có quyền",
            message: "Chỉ học viên mới có thể mở chat với giảng viên từ màn khóa học.",
            type: "error"
        });
        return;
    }

    const courseId = course.id;
    const instructorId = course.instructor_id;
    if (!courseId || !instructorId) {
        showToast({
            title: "Lỗi",
            message: "Không tìm thấy thông tin giảng viên cho khóa học này.",
            type: "error"
        });
        return;
    }

    try {
        const conversation = await apiRequest("/chat/conversations", {
            method: "POST",
            body: JSON.stringify({
                student_id: currentUser.id,
                instructor_id: instructorId,
                course_id: courseId
            })
        });

        currentChatConversation = {
            id: conversation.id,
            course_id: conversation.course_id || courseId,
            instructor_id: conversation.instructor_id || instructorId
        };

        const chatEl = document.getElementById("course-chat");
        if (chatEl) {
            chatEl.classList.remove("hidden");
        }
        await loadChatMessages(currentChatConversation.id);

        if (chatRefreshInterval) {
            clearInterval(chatRefreshInterval);
        }
        chatRefreshInterval = setInterval(() => {
            if (currentChatConversation) {
                loadChatMessages(currentChatConversation.id).catch((err) =>
                    console.warn("Không thể làm mới tin nhắn chat:", err)
                );
            }
        }, 5000);
    } catch (err) {
        console.error(err);
        showToast({
            title: "Lỗi chat",
            message: "Không thể mở cuộc trò chuyện với giảng viên.",
            type: "error"
        });
    }
}

async function loadChatMessages(conversationId) {
    const messagesContainer = document.getElementById("course-chat-messages");
    if (!messagesContainer) return;
    try {
        const messages = await apiRequest(`/chat/conversations/${conversationId}/messages`);
        renderChatMessages(messages);
    } catch (err) {
        console.error(err);
        messagesContainer.innerHTML = `<p class="message error">Không thể tải tin nhắn.</p>`;
    }
}

function renderChatMessages(messages) {
    const messagesContainer = document.getElementById("course-chat-messages");
    if (!messagesContainer) return;

    if (!Array.isArray(messages) || !messages.length) {
        messagesContainer.innerHTML = `<p class="hint">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện.</p>`;
        return;
    }

    messagesContainer.innerHTML = messages
        .map((m) => {
            const isMine = currentUser && m.sender_id === currentUser.id;
            const senderName = m.sender_name || m.sender_username || (isMine ? "Bạn" : "Giảng viên");
            return `
                <div class="chat-message ${isMine ? "chat-message--me" : "chat-message--them"}">
                    <div class="chat-message__meta">
                        <span class="chat-message__sender">${escapeHtml(senderName)}</span>
                        <span class="chat-message__time">${formatDate(m.created_at)}</span>
                    </div>
                    <div class="chat-message__bubble">
                        ${escapeHtml(m.content || "").replace(/\\n/g, "<br>")}
                    </div>
                </div>
            `;
        })
        .join("");

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function handleSendChatMessage(event) {
    event.preventDefault();
    if (!currentUser || !currentChatConversation) {
        showToast({
            title: "Lỗi chat",
            message: "Chưa khởi tạo cuộc trò chuyện với giảng viên.",
            type: "error"
        });
        return;
    }

    const input = document.getElementById("course-chat-input");
    if (!input) return;
    const content = (input.value || "").trim();
    if (!content) {
        return;
    }

    try {
        await apiRequest("/chat/messages", {
            method: "POST",
            body: JSON.stringify({
                conversation_id: currentChatConversation.id,
                sender_id: currentUser.id,
                content
            })
        });
        input.value = "";
        await loadChatMessages(currentChatConversation.id);
    } catch (err) {
        console.error(err);
        showToast({
            title: "Lỗi",
            message: "Không thể gửi tin nhắn.",
            type: "error"
        });
    }
}

async function fetchProgress() {
    if (!currentUser) return;
    if (isStudent()) {
        try {
            const progressPromise = apiRequest(`/users/${currentUser.id}/progress`);
            const assignmentsPromise = apiRequest(
                `/students/${currentUser.id}/progress/assignments`
            );
            const examsPromise = apiRequest(
                `/students/${currentUser.id}/progress/exams`
            );

            const [progress, assignmentResults, examResults] = await Promise.all([
                progressPromise,
                assignmentsPromise,
                examsPromise
            ]);

            renderStudentProgress(
                Array.isArray(progress) ? progress : [],
                Array.isArray(assignmentResults) ? assignmentResults : [],
                Array.isArray(examResults) ? examResults : []
            );
        } catch (err) {
            console.error(err);
            elements.progressList.innerHTML =
                `<p class="message error">Không thể tải tiến độ học viên.</p>`;
        }
    } else if (isInstructor()) {
        try {
            const data = await apiRequest(`/instructors/${currentUser.id}/students`);
            renderInstructorProgress(data);
        } catch (err) {
            console.error(err);
            elements.progressList.innerHTML =
                `<p class="message error">Không thể tải danh sách học viên.</p>`;
        }
    } else {
        elements.progressList.innerHTML =
            '<p class="hint">Chức năng Tiến độ chỉ dành cho học viên hoặc giảng viên.</p>';
    }
}

function renderStudentProgress(progress, assignmentResults, examResults) {
    if (!Array.isArray(progress) || !progress.length) {
        elements.progressList.innerHTML = "<p>Chưa có dữ liệu tiến độ.</p>";
        return;
    }

    const assignmentsByCourse = {};
    (assignmentResults || []).forEach((r) => {
        if (!r.course_id || !r.assignment_id) return;
        if (!assignmentsByCourse[r.course_id]) assignmentsByCourse[r.course_id] = [];
        assignmentsByCourse[r.course_id].push(r);
    });

    const examsByCourse = {};
    (examResults || []).forEach((r) => {
        if (!r.course_id || !r.exam_id) return;
        if (!examsByCourse[r.course_id]) examsByCourse[r.course_id] = [];
        examsByCourse[r.course_id].push(r);
    });

    elements.progressList.innerHTML = progress
        .map((item) => {
            const courseAssignments = assignmentsByCourse[item.course_id] || [];
            const courseExams = examsByCourse[item.course_id] || [];

            const assignmentsHtml = courseAssignments.length
                ? courseAssignments
                      .map((a) => {
                          const statusLabel =
                              a.status === "graded"
                                  ? "Đã chấm"
                                  : a.status === "submitted"
                                  ? "Đã nộp"
                                  : "Chưa nộp";
                          const scoreText =
                              a.score != null
                                  ? `${Number(a.score)} / ${Number(a.max_score || 10)}`
                                  : "-";
                          const due = a.due_at
                              ? new Date(a.due_at).toLocaleString("vi-VN")
                              : "Không giới hạn";

                          return `
                    <div class="student-item student-item--compact">
                        <div class="student-item__main">
                            <h4>${escapeHtml(
                                a.assignment_title ||
                                    a.assignment_id?.toString() ||
                                    "Bài tập"
                            )}</h4>
                            <p class="student-item__meta">
                                <span>Điểm tối đa: ${Number(a.max_score || 10)}</span>
                                <span>• Hạn nộp: ${due}</span>
                            </p>
                        </div>
                        <div class="student-item__status-row">
                            <span class="student-status student-status--${
                                a.status || "not_submitted"
                            }">
                                ${statusLabel}
                            </span>
                            <span class="student-score-label">Điểm: ${scoreText}</span>
                        </div>
                        ${
                            a.feedback
                                ? `<p class="student-feedback"><strong>Nhận xét:</strong> ${escapeHtml(
                                      a.feedback
                                  )}</p>`
                                : ""
                        }
                    </div>
                `;
                      })
                      .join("")
                : `<p class="hint">Chưa có bài tập nào.</p>`;

            const examsHtml = courseExams.length
                ? courseExams
                      .map((e) => {
                          const statusLabel =
                              e.status === "graded"
                                  ? "Đã chấm"
                                  : e.status === "submitted"
                                  ? "Đã nộp"
                                  : "Chưa làm";
                          const scoreText =
                              e.total_score != null
                                  ? `${Number(e.total_score)} / ${Number(e.max_score || 10)}`
                                  : "-";
                          const start = e.start_at
                              ? new Date(e.start_at).toLocaleString("vi-VN")
                              : "Không giới hạn";
                          const end = e.end_at
                              ? new Date(e.end_at).toLocaleString("vi-VN")
                              : "Không giới hạn";

                          return `
                    <div class="student-item student-item--compact">
                        <div class="student-item__main">
                            <h4>${escapeHtml(
                                e.exam_title || e.exam_id?.toString() || "Đề thi"
                            )}</h4>
                            <p class="student-item__meta">
                                <span>Điểm tối đa: ${Number(e.max_score || 10)}</span>
                                <span>• Thời lượng: ${e.duration_minutes || 0} phút</span>
                                <span>• Từ: ${start}</span>
                                <span>• Đến: ${end}</span>
                            </p>
                        </div>
                        <div class="student-item__status-row">
                            <span class="student-status student-status--${
                                e.status || "not_submitted"
                            }">
                                ${statusLabel}
                            </span>
                            <span class="student-score-label">Điểm: ${scoreText}</span>
                        </div>
                    </div>
                `;
                      })
                      .join("")
                : `<p class="hint">Chưa có đề thi nào.</p>`;

            return `
        <article class="card">
            <h3>${item.course_title}</h3>
            <p><strong>Giảng viên:</strong> ${
                item.instructor_name || "Chưa cập nhật"
            }${
                item.instructor_email
                    ? ` - <a href="mailto:${item.instructor_email}">${item.instructor_email}</a>`
                    : ""
            }</p>
            <p><strong>Hoàn thành bài học:</strong> ${item.progress_percent}%</p>
            <p><strong>Lần truy cập cuối:</strong> ${
                item.last_access_at
                    ? new Date(item.last_access_at).toLocaleDateString("vi-VN")
                    : "Chưa có"
            }</p>
            <details class="progress-lessons">
                <summary class="progress-lessons__summary">
                    <span class="progress-lessons__title">Danh sách bài học</span>
                    <span class="progress-lessons__hint">Nhấp để xem chi tiết</span>
                </summary>
                ${
                    (item.lessons || [])
                        .map(
                            (lesson) => `
                    <div class="lesson-item lesson-item--progress">
                        <div class="lesson-item__main">
                            <span class="lesson-item__title">${lesson.lesson_title}</span>
                            <span class="lesson-item__status lesson-item__status--${
                                lesson.status
                            }">
                                ${
                                    lesson.status === "completed"
                                        ? "Đã hoàn thành"
                                        : lesson.status === "in_progress"
                                        ? "Đang học"
                                        : "Chưa học"
                                }
                            </span>
                        </div>
                        <div class="lesson-item__meta">
                            ${
                                lesson.completed_at
                                    ? `<span class="lesson-item__date">Hoàn thành: ${new Date(
                                          lesson.completed_at
                                      ).toLocaleDateString("vi-VN")}</span>`
                                    : ""
                            }
                        </div>
                    </div>
                `
                        )
                        .join("") || "<p>Chưa có bài học nào.</p>"
                }
            </details>

            <details class="progress-lessons">
                <summary class="progress-lessons__summary">
                    <span class="progress-lessons__title">Bài tập & Đề thi của bạn</span>
                    <span class="progress-lessons__hint">Nhấp để xem chi tiết</span>
                </summary>
                <section class="student-course-work">
                    <div class="student-pane">
                        <h5>Bài tập</h5>
                        ${assignmentsHtml}
                    </div>
                    <div class="student-pane">
                        <h5>Đề thi</h5>
                        ${examsHtml}
                    </div>
                </section>
            </details>
        </article>
        `;
        })
        .join("");
}

function renderInstructorProgress(courses) {
    if (!Array.isArray(courses) || !courses.length) {
        elements.progressList.innerHTML =
            "<p>Hiện chưa có học viên nào đăng ký các học phần bạn đang giảng dạy.</p>";
        return;
    }

    elements.progressList.innerHTML = courses
        .map((course) => {
            const students = Array.isArray(course.students) ? course.students : [];
            if (!students.length) {
                return `
            <article class="card">
                <h3>${course.course_title}</h3>
                <p class="hint">Chưa có học viên đăng ký.</p>
            </article>
            `;
            }

            const studentsHtml = students
                .map((s) => {
                    const name = s.student_name || s.student_email || "Học viên";
                    const initials = (name || "S")
                        .trim()
                        .split(/\\s+/)
                        .map((part) => part[0]?.toUpperCase() || "")
                        .join("")
                        .slice(0, 2);
                    const progress =
                        typeof s.progress_percent === "number" ? s.progress_percent : 0;
                    const lastAccess = s.last_access_at
                        ? new Date(s.last_access_at).toLocaleDateString("vi-VN")
                        : "Chưa có";

                    return `
                <div class="course-student-item">
                    <div class="course-student-item__main">
                        <div class="course-student-item__avatar">${escapeHtml(initials)}</div>
                        <div class="course-student-item__info">
                            <div class="course-student-item__name">${escapeHtml(name)}</div>
                            <div class="course-student-item__meta">
                                <span>Tiến độ: ${progress}%</span>
                                <span> • Lần truy cập cuối: ${lastAccess}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                })
                .join("");

            return `
        <article class="card">
            <h3>${course.course_title}</h3>
            <p class="hint">Số học viên: ${students.length}</p>
            <div class="course-students-list">
                ${studentsHtml}
            </div>
        </article>
        `;
        })
        .join("");
}

async function handleRegister(event) {
    event.preventDefault();
    if (!elements.registerForm) return;

    const formData = new FormData(elements.registerForm);
    const full_name = (formData.get("full_name") || "").trim();
    const username = (formData.get("username") || "").trim();
    const email = (formData.get("email") || "").trim();
    const password = formData.get("password") || "";
    const role = "student";

    if (!full_name || !username || !email || !password) {
        setRegisterMessage("error", "Vui lòng điền đầy đủ thông tin.");
        return;
    }

    if (password.length < 6) {
        setRegisterMessage("error", "Mật khẩu cần ít nhất 6 ký tự.");
        return;
    }

    const password_hash = encodePasswordBase64(password);
    if (!password_hash) {
        setRegisterMessage("error", "Không thể mã hóa mật khẩu.");
        return;
    }

    try {
        setRegisterMessage("success", "Đang gửi yêu cầu...");
        const response = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                full_name,
                username,
                email,
                password_hash,
                role
            })
        });

        setRegisterMessage("success", "Đăng ký học viên thành công! Vui lòng liên hệ quản trị viên để kích hoạt.");
        elements.registerForm.reset();
        setActiveAuthTab("login");
        const usernameInput = document.getElementById("username");
        if (usernameInput) {
            usernameInput.value = response?.username || username;
        }
        showToast({
            title: "Đăng ký thành công",
            message: "Thông tin đã được gửi. Liên hệ quản trị viên để kích hoạt tài khoản.",
            type: "success"
        });
    } catch (err) {
        console.error(err);
        let message = "Không thể đăng ký. Vui lòng thử lại.";
        if (err.status === 409) {
            message = err.payload?.message || "Tên đăng nhập hoặc email đã tồn tại.";
        } else if (err.status === 400) {
            message = err.payload?.message || "Dữ liệu đăng ký không hợp lệ.";
        }
        setRegisterMessage("error", message);
        showToast({
            title: "Đăng ký thất bại",
            message,
            type: "error"
        });
    }
}

async function handleChangePassword(event) {
    event.preventDefault();
    if (!currentUser) {
        setChangePasswordMessage("error", "Bạn cần đăng nhập trước khi đổi mật khẩu.");
        return;
    }
    if (!elements.changePasswordForm) return;

    const formData = new FormData(elements.changePasswordForm);
    const oldPassword = formData.get("old_password") || "";
    const newPassword = formData.get("new_password") || "";
    const confirmPassword = formData.get("confirm_password") || "";

    if (!oldPassword || !newPassword || !confirmPassword) {
        setChangePasswordMessage("error", "Vui lòng nhập đầy đủ thông tin.");
        return;
    }
    if (newPassword.length < 6) {
        setChangePasswordMessage("error", "Mật khẩu mới cần ít nhất 6 ký tự.");
        return;
    }
    if (newPassword !== confirmPassword) {
        setChangePasswordMessage("error", "Mật khẩu mới và xác nhận không khớp.");
        return;
    }

    const oldHash = encodePasswordBase64(oldPassword);
    const newHash = encodePasswordBase64(newPassword);
    if (!oldHash || !newHash) {
        setChangePasswordMessage("error", "Không thể mã hóa mật khẩu. Vui lòng thử lại.");
        return;
    }
    if (oldHash === newHash) {
        setChangePasswordMessage("error", "Mật khẩu mới không được trùng với mật khẩu cũ.");
        return;
    }

    try {
        setChangePasswordMessage("success", "Đang cập nhật mật khẩu...");
        await apiRequest("/auth/change-password", {
            method: "POST",
            body: JSON.stringify({
                user_id: currentUser.id,
                old_password_hash: oldHash,
                new_password_hash: newHash
            })
        });
        setChangePasswordMessage("success", "Đổi mật khẩu thành công!");
        elements.changePasswordForm.reset();
        showToast({
            title: "Đổi mật khẩu",
            message: "Mật khẩu của bạn đã được cập nhật.",
            type: "success"
        });
    } catch (err) {
        console.error(err);
        let message = "Không thể đổi mật khẩu. Vui lòng thử lại.";
        if (err.status === 401) {
            message = "Mật khẩu hiện tại không chính xác.";
        } else if (err.status === 404) {
            message = "Không tìm thấy tài khoản.";
        } else if (err.status === 400) {
            message = err.payload?.message || message;
        }
        setChangePasswordMessage("error", message);
        showToast({
            title: "Đổi mật khẩu thất bại",
            message,
            type: "error"
        });
    }
}

elements.loginForm.addEventListener("submit", handleLogin);
elements.registerForm?.addEventListener("submit", handleRegister);
elements.changePasswordForm?.addEventListener("submit", handleChangePassword);
elements.authTabLogin?.addEventListener("click", () => setActiveAuthTab("login"));
elements.authTabRegister?.addEventListener("click", () => setActiveAuthTab("register"));
elements.toastClose?.addEventListener("click", hideToast);
elements.btnLogin?.addEventListener("click", () => {
    if (currentUser) return;
    // Khi mở màn đăng nhập: ẩn toàn bộ nội dung khác, chỉ hiển thị panel auth
    toggleSection(elements.settingsPanel, false);
    toggleSection(elements.coursesSection, false);
    toggleSection(elements.courseDetailSection, false);
    toggleSection(elements.progressSection, false);
    toggleSection(elements.forumSection, false);
    toggleSection(elements.forumPostDetailSection, false);
    toggleSection(elements.authPanel, true);
    setActiveAuthTab("login");
});
elements.btnOpenSettings?.addEventListener("click", () => {
    if (!currentUser) return;
    // Khi mở màn cài đặt, ẩn panel auth để tránh chồng chéo
    toggleSection(elements.authPanel, false);
    // Ẩn toàn bộ các tab nội dung khác để chỉ tập trung vào màn cài đặt
    toggleSection(elements.coursesSection, false);
    toggleSection(elements.courseDetailSection, false);
    toggleSection(elements.progressSection, false);
    toggleSection(elements.forumSection, false);
    toggleSection(elements.forumPostDetailSection, false);
    toggleSection(elements.settingsPanel, true);
    setChangePasswordMessage(null, "");
    const activeBtn = elements.settingsPanel.querySelector(".settings-action.settings-action--active");
    const defaultTargetId = activeBtn?.dataset.settingsTarget || elements.profileSection?.id;
    if (defaultTargetId) {
        setActiveSettingsTab(defaultTargetId);
    }
});
elements.closeSettings?.addEventListener("click", () => {
    toggleSection(elements.settingsPanel, false);
    setChangePasswordMessage(null, "");
});
elements.openChangePassword?.addEventListener("click", () => {
    setChangePasswordMessage(null, "");
    setActiveSettingsTab("profile-section");
});
elements.btnViewCourses.addEventListener("click", () => {
    // Khi xem tab Khóa học: luôn ẩn panel đăng nhập/cài đặt, chỉ tập trung vào danh sách khóa
    toggleSection(elements.settingsPanel, false);
    toggleSection(elements.authPanel, false);
    toggleSection(elements.coursesSection, true);
    toggleCreateCourseSection(false);
    toggleSection(elements.courseDetailSection, false);
    toggleSection(elements.progressSection, false);
    toggleSection(elements.forumSection, false);
    toggleSection(elements.forumPostDetailSection, false);
    fetchCourses();
});
elements.btnCreateCourse?.addEventListener("click", () => {
    if (!currentUser || !isInstructor()) {
        showToast({
            title: "Yêu cầu quyền giảng viên",
            message: "Chỉ giảng viên mới có thể tạo khóa học mới.",
            type: "info"
        });
        return;
    }
    toggleCreateCourseSection(true);
});
elements.btnCancelCreateCourse?.addEventListener("click", () => {
    toggleCreateCourseSection(false);
});
elements.btnResetCreateCourse?.addEventListener("click", () => {
    elements.createCourseForm?.reset();
    setCreateCourseMessage(null, "");
    if (elements.createCourseLanguage) {
        if (programmingLanguages.length) {
            elements.createCourseLanguage.value = "";
        } else {
            setLanguageSelectPlaceholder("Đang tải danh sách ngôn ngữ...", true);
            loadProgrammingLanguages();
        }
    }
});
elements.createCourseForm?.addEventListener("submit", handleCreateCourseSubmit);
elements.btnViewProgress.addEventListener("click", () => {
    if (!currentUser) {
        showToast({
            title: "Yêu cầu đăng nhập",
            message: "Vui lòng đăng nhập hoặc đăng ký để xem tiến độ học tập.",
            type: "info"
        });
        toggleSection(elements.authPanel, true);
        toggleSection(elements.coursesSection, false);
        toggleSection(elements.courseDetailSection, false);
        toggleSection(elements.progressSection, false);
        toggleSection(elements.forumSection, false);
        toggleSection(elements.forumPostDetailSection, false);
        setActiveAuthTab("login");
        setMessage("error", "Bạn cần đăng nhập trước.");
        return;
    }
    if (!isStudent() && !isInstructor()) {
        setMessage("error", "Chức năng này chỉ dành cho học viên hoặc giảng viên.");
        return;
    }
    // Khi chuyển sang tab Tiến độ, tắt màn cài đặt nếu đang mở
    toggleSection(elements.settingsPanel, false);
    toggleSection(elements.coursesSection, false);
    toggleSection(elements.courseDetailSection, false);
    toggleSection(elements.progressSection, true);
    toggleSection(elements.forumSection, false);
    toggleSection(elements.forumPostDetailSection, false);
    fetchProgress();
});
elements.closeCourseDetail.addEventListener("click", () => {
    toggleSection(elements.courseDetailSection, false);
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
        chatRefreshInterval = null;
    }
    currentChatConversation = null;
});
elements.btnLogout?.addEventListener("click", handleLogout);
elements.btnViewForum?.addEventListener("click", () => {
    if (!currentUser) {
        showToast({
            title: "Yêu cầu đăng nhập",
            message: "Vui lòng đăng nhập hoặc đăng ký để xem diễn đàn.",
            type: "info"
        });
        toggleSection(elements.authPanel, true);
        toggleSection(elements.coursesSection, false);
        toggleSection(elements.courseDetailSection, false);
        toggleSection(elements.progressSection, false);
        toggleSection(elements.forumSection, false);
        toggleSection(elements.forumPostDetailSection, false);
        setActiveAuthTab("login");
        return;
    }
    // Khi chuyển sang tab Diễn đàn, tắt màn cài đặt nếu đang mở
    toggleSection(elements.settingsPanel, false);
    toggleSection(elements.coursesSection, false);
    toggleSection(elements.courseDetailSection, false);
    toggleSection(elements.progressSection, false);
    toggleSection(elements.forumPostDetailSection, false);
    toggleSection(elements.forumSection, true);
    fetchForumPosts();
});
elements.btnCreatePost?.addEventListener("click", () => {
    if (!currentUser) {
        showToast({
            title: "Yêu cầu đăng nhập",
            message: "Bạn cần đăng nhập để đăng bài.",
            type: "info"
        });
        return;
    }
    toggleSection(elements.createPostForm, true);
});
elements.btnCancelPost?.addEventListener("click", () => {
    toggleSection(elements.createPostForm, false);
    elements.postForm?.reset();
    setPostMessage(null, "");
});
elements.postForm?.addEventListener("submit", handleCreatePost);
elements.closePostDetail?.addEventListener("click", () => {
    toggleSection(elements.forumPostDetailSection, false);
    toggleSection(elements.forumSection, true);
});

elements.coursesSearchInput?.addEventListener("input", (e) => {
    currentCourseSearch = e.target.value || "";
    applyCourseSearch();
});

elements.coursesSearchClear?.addEventListener("click", () => {
    if (!elements.coursesSearchInput) return;
    elements.coursesSearchInput.value = "";
    currentCourseSearch = "";
    applyCourseSearch();
    elements.coursesSearchInput.focus();
});

elements.languageFilterClear?.addEventListener("click", () => {
    currentLanguageFilter = null;
    updateLanguageFilterClearButton();
    if (elements.languageFilters) {
        elements.languageFilters.querySelectorAll(".language-filter-btn").forEach(btn => {
            btn.classList.remove("language-filter-btn--active");
        });
    }
    applyCourseSearch();
});

// Event delegation cho reply buttons
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("reply-comment-btn")) {
        const commentId = e.target.dataset.commentId;
        const replyForm = document.getElementById(`reply-form-${commentId}`);
        if (replyForm) {
            replyForm.classList.remove("hidden");
        }
    }
    if (e.target.classList.contains("cancel-reply")) {
        const commentId = e.target.dataset.commentId;
        const replyForm = document.getElementById(`reply-form-${commentId}`);
        const replyContent = document.getElementById(`reply-content-${commentId}`);
        if (replyForm) replyForm.classList.add("hidden");
        if (replyContent) replyContent.value = "";
    }
    if (e.target.classList.contains("submit-reply")) {
        const commentId = e.target.dataset.commentId;
        const postId = e.target.dataset.postId;
        const replyContent = document.getElementById(`reply-content-${commentId}`);
        const content = (replyContent?.value || "").trim();
        
        if (!content) {
            showToast({
                title: "Lỗi",
                message: "Vui lòng nhập nội dung phản hồi.",
                type: "error"
            });
            return;
        }

        try {
            await apiRequest("/forum/comments", {
                method: "POST",
                body: JSON.stringify({
                    post_id: postId,
                    user_id: currentUser.id,
                    content,
                    parent_id: commentId
                })
            });
            if (replyContent) replyContent.value = "";
            const replyForm = document.getElementById(`reply-form-${commentId}`);
            if (replyForm) replyForm.classList.add("hidden");
            await openPostDetail(postId);
            showToast({
                title: "Thành công",
                message: "Phản hồi đã được gửi.",
                type: "success"
            });
        } catch (err) {
            console.error(err);
            showToast({
                title: "Lỗi",
                message: "Không thể gửi phản hồi.",
                type: "error"
            });
        }
    }
});

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || (document.body.classList.contains("theme-light") ? "light" : "dark");
applyTheme(savedTheme);
elements.themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
    applyTheme(nextTheme);
});

loadUserFromStorage();

// Nếu chưa có user, mặc định hiển thị tab Khoá học (ẩn panel đăng nhập) và tải danh sách khoá học
if (!currentUser) {
    toggleSection(elements.authPanel, false);
    toggleSection(elements.coursesSection, true);
    toggleSection(elements.courseDetailSection, false);
    toggleSection(elements.progressSection, false);
    toggleSection(elements.forumSection, false);
    toggleSection(elements.forumPostDetailSection, false);
    toggleSection(elements.settingsPanel, false);
    setActiveAuthTab("login");
    fetchCourses();
}

updateAuthState();
applyRolePermissions();
setRegisterMessage(null, "");
setActiveAuthTab("login");

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return "Chưa có";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ============================================================================
// Forum Functions
// ============================================================================

function setPostMessage(type, text) {
    if (!elements.postMessage) return;
    if (!type || !text) {
        elements.postMessage.className = "message";
        elements.postMessage.textContent = text || "";
        return;
    }
    elements.postMessage.className = `message ${type}`;
    elements.postMessage.textContent = text;
}

async function fetchForumPosts() {
    try {
        const posts = await apiRequest("/forum/posts");
        renderForumPosts(posts);
    } catch (err) {
        console.error(err);
        elements.forumPostsList.innerHTML = `<p class="message error">Không thể tải danh sách bài viết.</p>`;
    }
}

function renderForumPosts(posts) {
    if (!Array.isArray(posts) || !posts.length) {
        elements.forumPostsList.innerHTML = "<p>Chưa có bài viết nào trong diễn đàn.</p>";
        return;
    }
    elements.forumPostsList.innerHTML = posts
        .map((post) => {
            const authorName = post.author_name || post.username || "Người dùng";
            const initials = (authorName || "U")
                .trim()
                .split(/\s+/)
                .map((part) => part[0]?.toUpperCase() || "")
                .join("")
                .slice(0, 2);
            const preview =
                (post.content || "").length > 200
                    ? `${post.content.substring(0, 200)}...`
                    : post.content || "";

            return `
        <article class="forum-post-card">
            <header class="forum-post-card__header">
                <div class="forum-post-card__user">
                    <div class="forum-post-card__avatar">${escapeHtml(initials)}</div>
                    <div class="forum-post-card__user-info">
                        <div class="forum-post-card__username">${escapeHtml(authorName)}</div>
                        <div class="forum-post-card__time">${formatDate(post.created_at)}</div>
                    </div>
                </div>
                ${post.view_count > 0 ? `<span class="forum-post-card__views">${post.view_count} lượt xem</span>` : ""}
            </header>
            <div class="forum-post-card__body">
                <h3 class="forum-post-title">${escapeHtml(post.title)}</h3>
                <p class="forum-post-preview">${escapeHtml(preview)}</p>
            </div>
            <footer class="forum-post-footer">
                <button data-post-id="${post.id}" class="link-btn view-post-detail">Xem bài viết</button>
                <span class="forum-post-comments-count">${post.comments_count || 0} bình luận</span>
            </footer>
        </article>
        `;
        })
        .join("");

    elements.forumPostsList.querySelectorAll(".view-post-detail").forEach(btn => {
        btn.addEventListener("click", () => openPostDetail(btn.dataset.postId));
    });
}

async function openPostDetail(postId) {
    try {
        const post = await apiRequest(`/forum/posts/${postId}`);
        renderPostDetail(post);
        toggleSection(elements.forumPostDetailSection, true);
        toggleSection(elements.forumSection, false);
    } catch (err) {
        console.error(err);
        elements.forumPostDetail.innerHTML = `<p class="message error">Không thể tải bài viết.</p>`;
        toggleSection(elements.forumPostDetailSection, true);
    }
}

async function renderPostDetail(post) {
    const commentsHTML = await renderComments(post.id, post.comments || []);
    
    elements.forumPostDetail.innerHTML = `
        <article class="forum-post-full">
            <div class="forum-post-full-header">
                <h2>${escapeHtml(post.title)}</h2>
                <div class="forum-post-full-meta">
                    <span><strong>${escapeHtml(post.author_name || post.username || "Người dùng")}</strong></span>
                    <span>•</span>
                    <span>${formatDate(post.created_at)}</span>
                    ${post.view_count > 0 ? `<span>•</span><span>${post.view_count} lượt xem</span>` : ""}
                </div>
            </div>
            <div class="forum-post-full-content">
                ${escapeHtml(post.content).replace(/\n/g, "<br>")}
            </div>
        </article>
        
        <div class="forum-comments-section">
            <h3>Bình luận (${(post.comments || []).length})</h3>
            ${currentUser ? `
                <form id="comment-form" class="form">
                    <textarea id="comment-content" name="content" placeholder="Viết bình luận của bạn..." required></textarea>
                    <button type="submit" class="btn btn--primary">Gửi bình luận</button>
                </form>
                <div id="comment-message" class="message"></div>
            ` : `<p class="hint">Đăng nhập để tham gia thảo luận.</p>`}
            <div id="comments-list" class="comments-list">
                ${commentsHTML}
            </div>
        </div>
    `;

    const commentForm = document.getElementById("comment-form");
    if (commentForm) {
        commentForm.addEventListener("submit", (e) => handleCreateComment(e, post.id));
    }

    // Tăng view count
    try {
        await apiRequest(`/forum/posts/${post.id}/view`, { method: "POST" });
    } catch (err) {
        console.warn("Không thể cập nhật lượt xem:", err);
    }
}

async function renderComments(postId, comments) {
    if (!Array.isArray(comments) || !comments.length) {
        return "<p class=\"hint\">Chưa có bình luận nào.</p>";
    }
    
    return comments.map(comment => `
        <div class="comment-item" data-comment-id="${comment.id}">
            <div class="comment-header">
                <strong>${escapeHtml(comment.author_name || comment.username || "Người dùng")}</strong>
                <span class="comment-date">${formatDate(comment.created_at)}</span>
            </div>
            <div class="comment-content">
                ${escapeHtml(comment.content).replace(/\n/g, "<br>")}
            </div>
            ${currentUser ? `
                <button class="link-btn reply-comment-btn" data-comment-id="${comment.id}">Trả lời</button>
                <div id="reply-form-${comment.id}" class="reply-form hidden">
                    <textarea id="reply-content-${comment.id}" placeholder="Viết phản hồi..." required></textarea>
                    <div class="form-actions">
                        <button type="button" class="btn btn--primary submit-reply" data-comment-id="${comment.id}" data-post-id="${postId}">Gửi</button>
                        <button type="button" class="btn btn--ghost cancel-reply" data-comment-id="${comment.id}">Hủy</button>
                    </div>
                </div>
            ` : ""}
            ${comment.replies && comment.replies.length > 0 ? `
                <div class="comment-replies">
                    ${comment.replies.map(reply => `
                        <div class="comment-item comment-reply">
                            <div class="comment-header">
                                <strong>${escapeHtml(reply.author_name || reply.username || "Người dùng")}</strong>
                                <span class="comment-date">${formatDate(reply.created_at)}</span>
                            </div>
                            <div class="comment-content">
                                ${escapeHtml(reply.content).replace(/\n/g, "<br>")}
                            </div>
                        </div>
                    `).join("")}
                </div>
            ` : ""}
        </div>
    `).join("");
}

async function handleCreatePost(event) {
    event.preventDefault();
    if (!currentUser) {
        setPostMessage("error", "Bạn cần đăng nhập để đăng bài.");
        return;
    }

    const formData = new FormData(elements.postForm);
    const title = (formData.get("title") || "").trim();
    const content = (formData.get("content") || "").trim();

    if (!title || !content) {
        setPostMessage("error", "Vui lòng điền đầy đủ tiêu đề và nội dung.");
        return;
    }

    try {
        setPostMessage("success", "Đang đăng bài...");
        const post = await apiRequest("/forum/posts", {
            method: "POST",
            body: JSON.stringify({
                user_id: currentUser.id,
                title,
                content
            })
        });
        setPostMessage("success", "Đăng bài thành công!");
        elements.postForm.reset();
        toggleSection(elements.createPostForm, false);
        fetchForumPosts();
        showToast({
            title: "Thành công",
            message: "Bài viết đã được đăng.",
            type: "success"
        });
    } catch (err) {
        console.error(err);
        setPostMessage("error", err.payload?.message || "Không thể đăng bài. Vui lòng thử lại.");
        showToast({
            title: "Lỗi",
            message: "Không thể đăng bài.",
            type: "error"
        });
    }
}

function setCommentMessage(type, text) {
    const commentMsg = document.getElementById("comment-message");
    if (!commentMsg) return;
    if (!type || !text) {
        commentMsg.className = "message";
        commentMsg.textContent = text || "";
        return;
    }
    commentMsg.className = `message ${type}`;
    commentMsg.textContent = text;
}

async function handleCreateComment(event, postId) {
    event.preventDefault();
    if (!currentUser) {
        setCommentMessage("error", "Bạn cần đăng nhập để bình luận.");
        return;
    }

    const contentEl = document.getElementById("comment-content");
    const content = (contentEl?.value || "").trim();

    if (!content) {
        setCommentMessage("error", "Vui lòng nhập nội dung bình luận.");
        return;
    }

    try {
        setCommentMessage("success", "Đang gửi bình luận...");
        await apiRequest("/forum/comments", {
            method: "POST",
            body: JSON.stringify({
                post_id: postId,
                user_id: currentUser.id,
                content
            })
        });
        setCommentMessage("success", "Bình luận đã được gửi!");
        if (contentEl) contentEl.value = "";
        // Reload post detail để cập nhật comments
        await openPostDetail(postId);
        showToast({
            title: "Thành công",
            message: "Bình luận đã được đăng.",
            type: "success"
        });
    } catch (err) {
        console.error(err);
        setCommentMessage("error", err.payload?.message || "Không thể gửi bình luận. Vui lòng thử lại.");
        showToast({
            title: "Lỗi",
            message: "Không thể gửi bình luận.",
            type: "error"
        });
    }
}

// Khởi động: kiểm tra health và hiển thị trạng thái nếu cần
(async function init() {
    try {
        await apiRequest("/health");
    } catch (err) {
        console.warn("Backend không phản hồi /health:", err);
    }
})();

