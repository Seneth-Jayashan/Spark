const LOGIN_LINK = "https://sparkvms.site/login";

const welcomeVolunteerTemplate = (firstName) => `
🌟 *Welcome to SPARK!* 🌟

👋 Hi *${firstName}*,

We’re excited to have you on board the *SPARK Volunteer Management System*! 💖  
Your passion and effort help make a positive impact in our communities. 🌍

💡 *Next Steps:*
• Explore upcoming events: [Login Here](${LOGIN_LINK}) 🗓️  
• Connect with other volunteers 💬  
• Track your participation and impact 📊

If you ever need assistance, our support team is always here for you. 💌

Warm regards,  
⚡ *The SPARK VMS Team*
`;

const welcomeOrganizerTemplate = (firstName) => `
🚀 *Welcome to SPARK, ${firstName}!*  

We’re thrilled to have you join as an *Organization Admin*! 🌟  

Your leadership plays a key role in empowering volunteers and creating meaningful community impact. 💪  

✨ *Your Dashboard:*
• Create & manage your organization events: [Login Here](${LOGIN_LINK}) 🗓️  
• Track volunteer participation and impact 📊  
• Communicate with your teams 💬  

Together, we’ll make every event shine brighter! 🌍  

Warm regards,  
⚡ *The SPARK VMS Team*
`;

const welcomeOrganizationTemplate = (OrgName) => `
🎉 *Welcome to SPARK, ${OrgName}!*  

We’re thrilled to have your organization join the *SPARK Volunteer Management System*! 🌟  

💡 *Here’s what you can do:*
• Post and manage volunteer events: [Login Here](${LOGIN_LINK}) 🗓️  
• Track volunteer participation and impact 📊  
• Connect with a motivated community of volunteers 💬  

Together, we can create meaningful change and empower volunteers to make a difference! 💪  

Warm regards,  
⚡ *The SPARK VMS Team*
`;

module.exports = {
  welcomeVolunteerTemplate,
  welcomeOrganizerTemplate,
  welcomeOrganizationTemplate,
};
