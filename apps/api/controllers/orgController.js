const Organization = require('../models/organization');
const Member = require('../models/orgMember');
const User = require('../models/user');
const {sendOrgWelcomeEmail} = require('../utils/emailSender');
const { createNotification } = require('../utils/notification.js');

exports.getAllOrganization = async (req, res) => {
    try {
        const organizations = await Organization.find();
        if (!organizations || organizations.length === 0) {
            return res.status(404).json({ message: 'No organization found' });
        }
        res.status(200).json({ message: `${organizations.length} organization found`, organizations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrganizationById = async (req, res) => {
    try {
        const { org_id } = req.params;
        const organization = await Organization.findOne({ org_id});

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.status(200).json({ message: 'Organization found', organization });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createOrganization = async (req, res) => {
  try {
    const {
      org_name,
      org_description,
      org_type,
      industry,
      contact_email,
      contact_phone,
      website,
      address,
      social_links,
    } = req.body;

    // Parse nested fields (they come as JSON strings from FormData)
    const parsedAddress = address ? JSON.parse(address) : {};
    const parsedSocialLinks = social_links ? JSON.parse(social_links) : {};

    const org_owner = req.user.id;
    // Check if user already has an org
    const ownOrg = await Organization.findOne({ org_owner });
    if (ownOrg) {
      return res.status(401).json({ message: "You already have an organization" });
    }

    const newOrganization = new Organization({
      org_name,
      org_description,
      org_logo: req.file ? `/uploads/${req.file.filename}` : "",
      org_owner,
      org_type,
      industry,
      contact_email,
      contact_phone,
      website,
      address: parsedAddress,
      social_links: parsedSocialLinks,
    });

    await newOrganization.save();
    await sendOrgWelcomeEmail(contact_email,'Admin',org_name);
    await createNotification({
        title: 'New Organization Created', 
        message: `${org_name} Created\nType - ${org_type}\nContact - ${contact_phone}`, 
        type: 'info',
        targetRole: 'admin',
        isBroadcast: true
    });

    res.status(200).json({ message: "Organization created successfully", organization: newOrganization });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getOwnOrg = async (req, res) => {
  try {
    const ownerId = req.user.id; 
    if (!ownerId) {
      return res.status(401).json({ message: "Authentication error: User ID not found." });
    }

    const organization = await Organization.findOne({ org_owner: ownerId });

    if (!organization) {
      return res.status(404).json({ message: 'No organization found for this user.' });
    }

    res.status(200).json({ message: 'Organization found', organization });

  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const { org_id } = req.params;
    const updates = { ...req.body };


    // Parse nested fields if they exist
    if (updates.address) {
      updates.address = JSON.parse(updates.address);
    }
    if (updates.social_links) {
      updates.social_links = JSON.parse(updates.social_links);
    }

    // Handle uploaded logo
    if (req.file) {
      updates.org_logo = `/uploads/${req.file.filename}`;
    }

    const updatedOrganization = await Organization.findOneAndUpdate(
      { org_id },
      updates,
      { new: true } // return the updated document
    );

    if (!updatedOrganization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    await createNotification({
        title: `${updatedOrganization.org_name} Updated`, 
        message: `${updatedOrganization.org_name} Created\nType - ${updatedOrganization.org_type}\nContact - ${updatedOrganization.contact_phone}`, 
        type: 'info',
        targetRole: 'admin',
        isBroadcast: true
    });

    res.status(200).json({
      message: "Organization updated successfully",
      organization: updatedOrganization,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateOrganizationStatus = async (req,res) => {
    try{
        const {org_id} = req.params;
        const {org_status} = req.body;

        const organization = await Organization.findOne({org_id});

        if(!organization){
            return res.status(404).json({ message: 'Organization not found' });
        }

        await Organization.findOneAndUpdate(
            {org_id},
            {org_status},
            {new:true}
        )

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.deleteOrganization = async (req, res) => {
    try {
        const { org_id } = req.params;

        const deletedOrganization = await Organization.findOneAndDelete({ org_id});

        if (!deletedOrganization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        await createNotification({
            title: `${deletedOrganization.org_name} Updated`, 
            message: `${deletedOrganization.org_name} Deleted by Administration`, 
            type: 'warning',
            targetRole: 'organizer',
            recipient: deletedOrganization.org_owner,
            isBroadcast: false
        });

        res.status(200).json({ message: 'Organization deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Export organizations as CSV
exports.exportOrganizationsCsv = async (req, res) => {
    try {
        const orgs = await Organization.find().lean();
        if (!orgs || orgs.length === 0) {
            return res.status(404).json({ message: 'No organization found' });
        }

        const columns = [
            'org_id',
            'org_name',
            'org_type',
            'industry',
            'contact_email',
            'contact_phone',
            'website',
            'org_status',
            'created_at',
            'updated_at'
        ];

        const header = columns.join(',');
        const escape = (val) => {
            if (val === null || val === undefined) return '';
            const str = String(val).replace(/"/g, '""');
            if (str.search(/[",\n]/g) >= 0) return `"${str}` + `"`;
            return str;
        };
        const rows = orgs.map((o) => columns.map((c) => escape(o[c])).join(','));
        const csv = [header, ...rows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="organizations.csv"');
        return res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting organizations', error });
    }
};

exports.addMember = async (req,res) => {
    try{
        const {org_id} = req.params;

        const org = await Organization.findOne({org_id});

        if(!org){
            return res.status(404).json({ message: 'Organization not found' });
        }

        const {user_first_name,user_last_name,user_address,user_phone_number,user_email,user_password} = req.body;

        const userExist = await User.findOne({user_email});

        if(userExist) return res.status(401).json({message: 'Email already registered'});

        const hashedPassword = await bcrypt.hash(user_password,12);

        const user = new User({
            user_first_name,
            user_last_name,
            user_phone_number,
            user_address,
            user_profile_picture: req.file ? `/uploads/${req.file.filename}` : "",
            user_email,
            user_password: hashedPassword,
            user_role : "org_member",
        });

        await user.save();


        const newMember = new Member({
            user_id:user.user_id,
            org_id
        });

        await newMember.save();

        res.status(200).json({ message: 'Member Added successfully'});

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getMembersByOrgId = async(req,res) => {
    try{
        const {org_id} = req.params;

        const org = await Organization.findOne({org_id});

        if(!org){
            return res.status(404).json({ message: 'Organization not found' });
        }

        const members = await Member.find({org_id});

        if(!members){
            return res.status(404).json({message: '0 members found'});
        }

        res.status(200).json({message: `${members.length} members found`, members});
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getOrgByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        const userMember = await Member.findOne({user_id});

        if(!userMember){
            return res.status(404).json({ message: "User isn't associate with any organization" });
        }

        const org = await Organization.findOne({ org_id:userMember.org_id });

        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.status(200).json({ message: 'Organization found', org });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeMember = async(req,res) => {
    try{
        const {org_id} = req.params;
        const {user_id} = req.body;

        const org = await Organization.findOne({org_id});

        if(!org){
            return res.status(404).json({ message: 'Organization not found' });
        }

        const member = await Member.findOne({user_id});
        if(!member){
            return res.status(403).json({ message: "User isn't associate with any organization" });
        }

        const orgMember = await Member.findOne({ user_id, org_id });
        if (!orgMember) {
            return res.status(403).json({ message: "User isn't associate with this organization" });
        }

        await Member.findOneAndDelete({user_id,org_id});

        res.status(200).json({message: "User remove from this organization"});
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}


exports.removeAllMembersFromOrg = async (req, res) => {
    try {
        const { org_id } = req.params;

        const org = await Organization.findOne({ org_id });
        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        const result = await Member.deleteMany({ org_id });

        res.status(200).json({ 
            message: `${result.deletedCount} member(s) removed from the organization.` 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};