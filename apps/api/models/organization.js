const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require("./counter");

const organizationSchema = new Schema({
    org_id: { type: Number, unique: true },
    org_name: { type: String, required: true },
    org_description: { type: String, required: true },
    org_logo: { type: String, required: true },
    org_owner: { type: Number, required: true, unique: true }, 
    org_status: { type: Boolean, default: true },

    // 📌 Extended fields
    org_type: { type: String, enum: ["Company", "Non-Profit", "Educational", "Government", "Other"], default: "Other" },
    industry: { type: String },

    contact_email: { type: String, required: true },
    contact_phone: { type: String },
    website: { type: String },

    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postal_code: { type: String },
        country: { type: String }
    },

    social_links: {
        facebook: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        instagram: { type: String },
        youtube: { type: String }
    },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Auto increment org_id
organizationSchema.pre("save", async function (next) {
    if (!this.isNew) return next();

    try {
        const counter = await Counter.findOneAndUpdate(
            { name: "org_id" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        this.org_id = counter.value;
        next();
    } catch (error) {
        next(error);
    }
});

// Update timestamp
organizationSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
