class user{
    constructor(name, email, password){
        this.id = '';
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters
    getId(){
        return this.id;
    }
    getName(){
        return this.name;
    }
    getEmail(){
        return this.email;
    }
    getPassword(){
        return this.password;
    }
    //setters
    setId(id){
        this.id = id;
    }
    setName(name){
        this.name = name;
    }
    setEmail(email){
        this.email = email;
    }
    setPassword(password){
        this.password = password;
    }
}