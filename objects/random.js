class Random {
    constructor(){
        console.log("A random generated value was requested.")
    }
    randomString(length=null) {
        //if length is null(default case), return the function
        if(length===null) {
            return (length) => {
                var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$-_.+!*(),';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
            }
        }
        //else, return the result with specified length
        else {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$-_.+!*(),';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
    }
    randomBetween(min, max) {
        //generates a random number between 2 numbers
        return Math.random() * (max - min) + min;
    }
    randomColor() {
        //returns a random color hex
        let n = (Math.random() * 0xfffff * 1000000).toString(16);
        return '#' + n.slice(0, 6);
      }
}

module.exports = Random;