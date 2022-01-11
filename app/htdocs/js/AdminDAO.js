class AdminDAO {
    constructor(email, password) {
      this.emailAdress = email;
      this.passwordField = password;
    }
    
    getEmail() {
        return this.emailAdress;
    }

    getPassword() {
        return this.passwordField;
    }

}

module.exports = AdminDAO;