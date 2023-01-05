const chatbotConfig = {
  start: {
    text: "Are you a recruiter or candidate?",
    replyType: "inlineKeyboard",
    options: [
      {
        id: "recruiter",
        text: "Recruiter",
        callback_data: "Recruiter",
      },
      {
        id: "candidate",
        text: "Candidate",
        callback_data: "Candidate",
      },
    ],
    next: [
      {
        id: "recruiter",
        text: "Recruiter",
        callback_data: "Recruiter",
      },
      {
        id: "candidate",
        text: "Candidate",
        callback_data: "Candidate",
      },
    ],
  },
  recruiter: {
    text: "Enter your name",
    replyType: "text",
    next: "recruiterCompany",
    api: {
      endpointType: "recruiter",
      bodyParam: "name",
      reqType: "post",
      endpoint: "/",
    },
  },
  recruiterCompany: {
    text: "Enter your company",
    replyType: "text",
    next: "recruiterEmail",
    api: {
      endpointType: "recruiter",
      bodyParam: "companyName",
      reqType: "patch",
      endpoint: "/",
    },
  },
  recruiterEmail: {
    text: "Enter your company email",
    replyType: "keyboard",
    options: [
      {
        text: "Add Job Opening",
        id: "addOpening",
      },
      {
        text: "Your Openings",
        id: "yourOpenings",
      },
    ],
    api: {
      endpointType: "recruiter",
      bodyParam: "companyEmail",
      reqType: "patch",
      endpoint: "/",
    },
    next: [
      {
        text: "Add Job Opening",
        id: "addOpening",
      },
      {
        text: "Your Openings",
        id: "yourOpenings",
      },
    ],
  },
  editProfile: {
    text: "Edit your Profile",
    replyType: "text",
    next: "editName",
  },
  editName: {
    text: "Enter your name",
    replyType: "text",
    next: "editCompany",
    api: {
      endpointType: "recruiter",
      bodyParam: "name",
      reqType: "patch",
      endpoint: "/",
    },
  },
  editCompany: {
    text: "Edit your company name",
    replyType: "text",
    options: [
      {
        text: "Add Job Opening",
        id: "addOpening",
      },
      {
        text: "Your Openings",
        id: "yourOpenings",
      },
      {
        text: "Potential Candidates",
        id: "potentialCandidates",
      },
      {
        text: "Edit Profile",
        id: "editProfile",
      },
    ],
    api: {
      endpointType: "recruiter",
      bodyParam: "companyName",
      reqType: "patch",
      endpoint: "/",
    },
    next: [
      {
        text: "Add Job Opening",
        id: "addOpening",
      },
      {
        text: "Your Openings",
        id: "yourOpenings",
      },
      {
        text: "Potential Candidates",
        id: "potentialCandidates",
      },
      {
        text: "Edit Profile",
        id: "editProfile",
      },
    ],
  },
  addOpening: {
    text: "Add Job Opening description with skills and experience required",
    replyType: "keyboard",
    options: [
      {
        text: "Add Job Opening",
        id: "addOpening",
      },
      {
        text: "Your Openings",
        id: "yourOpenings",
      },
    ],
    api: {
      endpointType: "recruiter",
      reqType: "patch",
      endpoint: "/openings",
      bodyParam: { key: "description" },
    },
    next: [
      {
        text: "Add Job Opening",
        id: "addOpening",
      },
      {
        text: "Your Openings",
        id: "yourOpenings",
      },
    ],
  },
  yourOpenings: {
    text: "Your Openings",
    api: {
      endpointType: "recruiter",
      reqType: "get",
      endpoint: "/openings/",
    },
  },
  potentialCandidates: {
    text: "Potential Candidates",
    api: {
      endpointType: "recruiter",
      reqType: "get",
    },
  },
  candidate: {
    text: "Enter your name",
    replyType: "text",
    next: "candidateExp",
    api: {
      endpointType: "candidate",
      bodyParam: "name",
      reqType: "post",
      endpoint: "/",
    },
  },
  candidateExp: {
    text: "Enter your years of experience",
    replyType: "text",
    next: "candidateStatus",
    api: {
      endpointType: "candidate",
      bodyParam: "experience",
      reqType: "patch",
      endpoint: "/",
    },
  },
  candidateStatus: {
    text: "Are you employed or not employed currently ?",
    replyType: "inlineKeyboard",
    options: [
      {
        id: "employed",
        text: "Currently Employed",
        callback_data: "Currently Employed",
      },
      {
        id: "notEmployed",
        text: "Not Employed",
        callback_data: "Not Employed",
      },
    ],
    next: [
      {
        id: "employed",
        text: "Currently Employed",
        callback_data: "Currently Employed",
      },
      {
        id: "notEmployed",
        text: "Not Employed",
        callback_data: "Not Employed",
      },
    ],
    api: {
      endpointType: "candidate",
      bodyParam: "status",
      reqType: "patch",
      endpoint: "/",
    },
  },
  employed: {
    text: "Enter your current company",
    replyType: "text",
    next: "skills",
    api: {
      endpointType: "candidate",
      bodyParam: "companyName",
      reqType: "patch",
      endpoint: "/",
    },
  },
  notEmployed: {
    next: "skills",
  },
  skills: {
    text: "Enter your skills comma separated",
    replyType: "keyboard",
    api: {
      endpointType: "candidate",
      bodyParam: "skills",
      reqType: "patch",
      endpoint: "/",
    },
    next: [
      {
        text: "All Job Opening",
        id: "candidateOpenings",
      },
    ],
    options: [
      {
        text: "All Job Opening",
        id: "candidateOpenings",
      },
    ],
  },
  candidateOpenings: {
    text: "All Openings",
    api: {
      endpointType: "candidate",
      reqType: "get",
      endpoint: "/openings/",
    },
  },
  relevantOpenings: {
    text: "Relevant Openings",
    api: {
      endpointType: "candidate",
      reqType: "get",
      endpoint: "/openings/",
    },
  },
};

module.exports = {
  chatbotConfig,
};
