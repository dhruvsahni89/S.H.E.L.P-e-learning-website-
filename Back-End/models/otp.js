var mongoose = require('mongoose');

const otpschema = mongoose.Schema;

const otpSchema = new otpschema(
    {
        token: {
            type: String,
            required: true,
          },
        Otp:{
            type:String,
            require:true
        },
        email:{
            type:String,
            require:true
        }
    }
);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });
module.exports = OtpUser = mongoose.model('otp',otpSchema);