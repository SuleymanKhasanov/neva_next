export enum TranslationKeys {
  // Header
  HeaderMenuPassword = 'menu.password',
  HeaderLanguage = 'language',
  HeaderCreate = 'create',
  HeaderSearch = 'search',
  HeaderSave = 'save',
  HeaderLogo = 'logo',
  HeaderCatalog = 'catalog',

  // Sidebar
  SidebarClose = 'close',
  SidebarOpen = 'open',
  SidebarMenuMain = 'menu.main',
  SidebarMenuPlatform = 'menu.platform',
  SidebarMenuAdmin = 'menu.admin',
  SidebarMenuSettings = 'menu.settings',
  SidebarMenuSpecializations = 'menu.specializations',
  SidebarMenuUsers = 'menu.users',
  SidebarMenuEducationTitle = 'menu.education.title',
  SidebarMenuEducationInterview = 'menu.education.interview',
  SidebarMenuQuestions = 'menu.questions',
  SidebarMenuSkills = 'menu.skills',
  SidebarMenuCollections = 'menu.collections',
  SidebarRemoveSelected = 'remove.selected',
  SidebarTotalQuestions = 'total.questions',
  SidebarBackButton = 'back.button',

  // Modal
  ModalBlockTitle = 'block.title',
  ModalBlockDescription = 'block.description',
  ModalDeleteTitle = 'delete.title',
  ModalActionsOk = 'actions.ok',
  ModalActionsCancel = 'actions.cancel',
  ModalLoading = 'loading',
  ModalShow = 'show',
  ModalEdit = 'edit',
  ModalCancel = 'cancel',

  // Profile
  ProfileHello = 'hello',
  ProfileProfile = 'profile',
  ProfileAvatar = 'avatar',
  ProfileLogout = 'logout',
  ProfileSupport = 'support',

  CardButton = 'more_button',
  CallUs = 'call_us',

  ContactsMenu = 'contacts_menu',
  ContactsWithUs = 'contact_with_us',
  ChatWithSupport = 'chat_with_support',
}

export type Header = {
  menu: {
    password: string;
  };
  language: string;
  create: string;
  search: string;
  save: string;
  logo: string;
};

export type Sidebar = {
  close: string;
  open: string;
  menu: {
    main: string;
    platform: string;
    admin: string;
    settings: string;
    specializations: string;
    users: string;
    education: {
      title: string;
      interview: string;
    };
    questions: string;
    skills: string;
    collections: string;
  };
  remove: {
    selected: string;
  };
  total: {
    questions: string;
  };
  back: {
    button: string;
  };
};

export type Modal = {
  block: {
    title: string;
    description: string;
  };
  delete: {
    title: string;
  };
  actions: {
    ok: string;
    cancel: string;
  };
  loading: string;
  show: string;
  edit: string;
  cancel: string;
};

export type Profile = {
  hello: string;
  profile: string;
  avatar: string;
  logout: string;
  support: string;
};

export type Card = {
  more_button: string;
  call_us: string;
};

export type Contacts = {
  contacts_menu: string;
  contact_with_us: string;
  chat_with_support: string;
};

export type TranslationType = {
  header: Header;
  sidebar: Sidebar;
  modal: Modal;
  profile: Profile;
  card: Card;
  contacts: Contacts;
};

export type Locale = 'en' | 'ru' | 'uz' | 'kr';
