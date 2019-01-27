const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user with email id
      const Db = require('../app');
      var db = Db.db;
      var schema   = {
                   "selector": {
                       "email": email
                    }
      }
      db.find(schema,function(err,result){
         if(err)
           throw err;
         else if((JSON.stringify(result.docs))=="[]"){
            return done(null, false, { message: 'That email is not registered' });}
         else {
           //  Match password
             bcrypt.compare(password, result.docs[0].password, (err, isMatch) => {
               if (err) throw err;
               if (isMatch) {
                  return done(null, result);
               } else {
                  return done(null, false, { message: 'Password incorrect' });
               }
             });

             passport.serializeUser(function(result, done) {
               done(null, result.docs[0]._id);
             });

             passport.deserializeUser(function(_id, done) {
                  schema = {
                    "selector": {"_id":_id}
                  }
               db.find(schema, function(err, result) {
                 done(err, result);
               });
             });
        }});
      }));
};
