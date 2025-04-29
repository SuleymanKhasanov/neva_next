import { TranslationType } from './translations';

export async function loadTranslations(
  locale: string,
): Promise<TranslationType> {
  const defaultTranslations: TranslationType = {
    header: {
      menu: { password: 'Change Password' },
      language: 'Language',
      create: 'Create',
      search: 'Search',
      save: 'Save',
      logo: 'Logo',
    },
    sidebar: {
      close: 'Close',
      open: 'Open',
      menu: {
        main: 'Main',
        platform: 'Platform',
        admin: 'Admin',
        settings: 'Settings',
        specializations: 'Specializations',
        users: 'Users',
        education: { title: 'Education', interview: 'Interview' },
        questions: 'Questions',
        skills: 'Skills',
        collections: 'Collections',
      },
      remove: { selected: 'Remove Selected' },
      total: { questions: 'Total Questions' },
      back: { button: 'Back' },
    },
    modal: {
      block: { title: 'Block', description: 'Description' },
      delete: { title: 'Delete' },
      actions: { ok: 'OK', cancel: 'Cancel' },
      loading: 'Loading',
      show: 'Show',
      edit: 'Edit',
      cancel: 'Cancel',
    },
    profile: {
      hello: 'Hello',
      profile: 'Profile',
      avatar: 'Avatar',
      logout: 'Logout',
      support: 'Support',
    },
    card: {
      more_button: 'More',
      call_us: 'Call Us',
    },
    contacts: {
      contacts_menu: 'Contacts and Chat',
      contact_with_us: 'Contact us',
      chat_with_support: 'Chat with Support',
    },
  };

  try {
    const header = (
      await import(`@/shared/locales/${locale}/header.json`).catch(
        () => ({
          default: { header: defaultTranslations.header },
        }),
      )
    ).default;
    const sidebar = (
      await import(`@/shared/locales/${locale}/sidebar.json`).catch(
        () => ({
          default: { sidebar: defaultTranslations.sidebar },
        }),
      )
    ).default;
    const modal = (
      await import(`@/shared/locales/${locale}/modal.json`).catch(
        () => ({
          default: { modal: defaultTranslations.modal },
        }),
      )
    ).default;
    const profile = (
      await import(`@/shared/locales/${locale}/profile.json`).catch(
        () => ({
          default: { profile: defaultTranslations.profile },
        }),
      )
    ).default;
    const card = (
      await import(`@/shared/locales/${locale}/card.json`).catch(
        () => ({
          default: { card: defaultTranslations.card },
        }),
      )
    ).default;
    const contacts = (
      await import(`@/shared/locales/${locale}/contacts.json`).catch(
        () => ({
          default: { contacts: defaultTranslations.contacts },
        }),
      )
    ).default;

    return {
      header: header.header || defaultTranslations.header,
      sidebar: sidebar.sidebar || defaultTranslations.sidebar,
      modal: modal.modal || defaultTranslations.modal,
      profile: profile.profile || defaultTranslations.profile,
      card: card.card || defaultTranslations.card,
      contacts: contacts.contacts || defaultTranslations.contacts,
    };
  } catch (error) {
    console.error('Error in loadTranslations:', error);
    return defaultTranslations;
  }
}
