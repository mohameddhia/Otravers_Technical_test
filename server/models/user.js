const bcrypt = require('bcryptjs');
const {Genre} = require('../constants/enums');

class User {
    /** @type {string} */ #id;
    /** @type {string} */ #email;
    /** @type {string} */ #password;
    /** @type {string} */ #firstName;
    /** @type {string} */ #lastName;
    /** @type {Genre} */ #genre;
    /** @type {string} */ #birthDate;
    /** @type {IReview} */ #reviews;
    /** @type {string} */ #createdAt;
    /** @type {string} */ #updatedAt;

    constructor(_data){
        if(!User.validateEmail(_data.email)) 
            throw new Error('Invalid Email Format');
        if(!User.validateGenre(_data.genre)) 
            throw new Error(`Invalid Gender:${_data.genre} just Make it Straight :p`);

        this.#id = _data.id;
        this.#email = _data.email;
        this.#password = _data.password;
        this.#firstName = _data.firstName;
        this.#lastName = _data.lastName;
        this.#genre = _data.genre;
        this.#birthDate = new Date(_data.birthDate);
        (Array.isArray(_data.reviews) && _data.reviews.length !== 0) ?? this.#reviews.push(_data.reviews);
        this.#createdAt = new Date(_data.createdAt);
        this.#updatedAt = new Date(_data.updatedAt);
    }

    // ------------------ Getters ------------------ //
    get id() { return this.#id; }
    get email() { return this.#email; }
    get password() { return this.#password; }
    get firstName() { return this.#firstName; }
    get lastName() { return this.#lastName; }
    get genre() { return this.#genre; }
    get birthDate() { return this.#birthDate; }
    get reviews() { return this.#reviews; }
    get createdAt() { return this.#createdAt; }
    get updatedAt() { return this.#updatedAt; }

    // ------------------ Setters ------------------ //

     set email(_email){
        this.#email= _email;
    }

    set firstName(_firstName){
        this.#firstName = _firstName;
    }

    set lastName(_lastName){
        this.#lastName = _lastName
    }

    set birthDate(_birthDate){
        this.#birthDate = new Date(_birthDate);
    }
  
    set reviews(_reviews){
        if(!Array.isArray(_reviews) || _reviews.length === 0)
            throw new Error('Invalid Input')
        this.#reviews = _reviews;
    }
    
    /**
     * Set Email
     * @type {string}
     * @param {string} _email
     */
    set email(_email){
        if(!User.validateEmail(_email)) 
            throw new Error("Invalid Email Format");
        this.#email = _email
    }
    
    /**
     * Set Genre 
     *
     * @type {Genre} - MAN | WOMAN
     */
    set genre(_genre) {
        if (!User.validateGenre(_genre)) 
            throw new Error(`Invalid gender: ${_genre} Please Choose correct Gender MALE or FEMALE only`);
        this.#genre = _genre;
    }

    
    /**
     * Set Password
     *
     * @async
     * @param {string} _password 
     * @returns {void} 
     */
    async setPassword(_password){
        if(await this.comparePassword(this.#password , _password))
            throw new Error('New Password Cannot be the same Password');

        this.#password = await this.encryptPassword(_password);
    }

    // ----------- Static Methods -----------

    
    
    /**
     * Create Empty User Instance
     *
     * @static
     * @returns {import('./interfaces/IUser').IUser} 
     */
    static createEmpty(){
        return {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            genre: 'MAN',
            birthDate: new Date(),
            reviews: [],
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now())
        };
    }
    /**
     * Validate Email
     *
     * @static
     * @param {string} _email 
     * @returns {boolean} 
     */
    static validateEmail(_email){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(_email);    
    }

    
    /**
     * Validate Genre
     *
     * @static
     * @param {Genre} _genre 
     * @returns {boolean} 
     */
    static validateGenre(_genre){
            return Object.values(Genre).includes(_genre)
    }

    
    /**
     * Encrypy Password
     *
     * @static
     * @async
     * @param {string} _newPassword 
     * @returns {Promise<string>} 
     */
    static async encryptPassword(_newPassword){
        const saltRounds = 10;
        return await bcrypt.hash(_newPassword,saltRounds);
    }

    
    /**
     * Compare Password
     *
     * @static
     * @async
     * @param {string} _password 
     * @param {string} _hash 
     * @returns {Promise<boolean>} 
     */
    static async comparePassword(_password ,_hash){
        if(!_hash) return false;
        return await bcrypt.compare(_password,_hash);
    }

    toJson(){
        return {
            id: this.#id,
            email: this.#email,
            password: this.#password,
            firstName: this.#firstName,
            lastName: this.#lastName,
            genre: this.#genre,
            birthDate: this.#birthDate,
            reviews: this.#reviews,
            createdAt: this.#createdAt,
            updatedAt: this.#updatedAt
        }
    }
}

module.exports = User;