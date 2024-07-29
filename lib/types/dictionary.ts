export interface Dictionary {
  home: {
    findSomething: string;
    perfect: string;
    make: string;
    some: string;
    fun: string;
    description: string;
  };
  about: {
    hero: {
      title: string;
      description: string;
      primaryButton: string;
      secondaryButton: string;
    };
    aboutUs: {
      title: string;
      startingWord: string;
      description: string;
      button: string;
    };
    ourConcept: {
      title: string;
      description: string;
      button: string;
    };
    article: {
      title: string;
      subtitle: string;
      description: string;
    };
    ourConceptDetails: {
      title: string;
      subtitle: string;
      description: string;
    };
    getStarted: {
      title: string;
      description: string;
      button: string;
    };
  };
  contact: {
    hero: {
      title: string;
      description: string;
    };
    form: {
      title: string;
      name: {
        label: string;
        placeholder: string;
      };
      email: {
        label: string;
        placeholder: string;
      };
      message: {
        label: string;
        placeholder: string;
      };
      submit: string;
      toast: {
        success: {
          title: string;
          description: string;
        };
        error: {
          title: string;
          description: string;
        };
      };
      validation: {
        name: string;
        email: string;
        message: {
          required: string;
          maxLength: string;
        };
      };
    };
    details: {
      callUs: string;
      phoneNumber: string;
      email: string;
      emailAddress: string;
      location: string;
      address: string;
    };
  };
  news: {
    hero: {
      title: string;
      description: string;
    };
    article: {
      title: string;
      subtitle: string;
      description: string;
    };
    ourConceptDetails: {
      title: string;
      subtitle: string;
      description: string;
    };
    section1: {
      title: string;
      startingWord: string;
      description: string;
      button: string;
    };
    section2: {
      title: string;
      startingWord: string;
      description: string;
      button: string;
    };
  };
  preRegister: {
    hero: {
      title: string;
      description: string;
    };
    content: {
      title: string;
      description: string;
    };
    form: {
      title: string;
      name: {
        label: string;
        placeholder: string;
      };
      email: {
        label: string;
        placeholder: string;
      };
      phone: {
        label: string;
        placeholder: string;
        countryCode: {
          placeholder: string;
          label: string;
        };
      };
      dob: {
        label: string;
        placeholder: string;
      };
      TOS: {
        label: string;
        link: string;
      };
      submit: string;
      submitToast: {
        success: {
          title: string;
          description: string;
        };
        error: {
          title: string;
          description: string;
        };
      };
      validation: {
        name: string;
        email: string;
        dob: string;
      };
    };
    TOS: {
      title: string;
      description: string;
    };
  };
  header: {
    logo: string;
    button: string;
    MainHeader: {
      Home: string;
      About: string;
      News: string;
      Contact: string;
      PreRegister: string;
    };
  };

  footer: {
    legal: string;
    privacy: string;
    followUs: string;
  };
  legal: {
    hero: {
      title: string;
      description: string;
    };
    legalNotice: {
      title: string;
      description: string;
    };
    articles: {
      title: string;
      description: string;
    }[];
  };
  // In your dictionary file
  cookies: {
    title: string;
    description: string;
    necessary: string;
    analytics: string;
    thirdParty: string;
    saveChoices: string;
    acceptAll: string;
    rejectAll: string;
  };
}
