export const validateUsername = (username) => {
    const usernamePattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,}$/;
    if (!usernamePattern.test(username)) {
        return "Invalid Username, at least 4 characters and 1 letter";
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