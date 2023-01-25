const mongoose = require('mongoose');

const WarningsSchema = mongoose.model("WarningsSchema",
    new mongoose.Schema(
        {
            guild: {
                type: String,
                required: true
            },
            user: {
                type: String,
                required: true
            },
            warnings: {
                type: [Object],
                required: true
            }
        }
    )
);


module.exports = { WarningsSchema };