export const validateUsername = (username) => {
    const usernamePattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{1,8}$/;
    if (!usernamePattern.test(username)) {
        return "Invalid, up to 8 characters and at least 1 letter";
    }
    return "";
};

export const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(email)) {
        return "Invalid Email";
    }
    return "";
};

export const validatePassword = (password) => {
    if (password.length < 6) {
        return "Invalid Password, at least 6 characters long";
    }
    return "";
};