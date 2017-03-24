export const tabs = [
  {key: 'identity', label: 'Identity', icon: 'user'},
  {key: 'records', label: 'Records', icon: 'file text outline'},
  {key: 'requests', label: 'Requests', icon: 'hourglass outline'},
  {key: 'resume', label: 'People', icon: 'user'}
  
];

export const recordTypes = [
  {key: 'reference', value: 'reference', text: 'Reference'}
  /*{key: 'membership', value: 'membership', text: 'Membership'},
  {key: 'diploma', value: 'diploma', text: 'Diploma'}, */
];

export const identityFields = {
  name: {key: 'name', label: 'Name', icon: '', shownInHeader: true},
  shortdesc: {key: 'shortdesc', label: '', icon: '', shownInHeader: true},
  birthdate: {key: 'birthdate', label: 'Birth date', icon: 'calendar'},
  email: {key: 'email', label:' E-mail', icon: 'mail outline'},
  longdesc: {key: 'longdesc', label: 'Description', icon: 'info circle', longForm: true},
};

export const identityDisplayOrder = [
  'name', 'shortdesc', 'birthdate', 'email', 'longdesc'
];

export const placeholderId = {
    name: 'George Orwell',
    birthdate: '1903-06-25',
    email: 'george.orwell@minitrue.com',
    shortdesc: 'Novelist, essayist, journalist and critic.',
    longdesc: 'Best known for his dystopian novel Nineteen Eighty-Four (published in 1949) and the allegorical novella Animal Farm (1945). His non-fiction works, including The Road to Wigan Pier (1937), documenting his experience of working class life in the north of England, and Homage to Catalonia (1938), an account of his experiences in the Spanish Civil War, are widely acclaimed, as are his essays on politics, literature, language, and culture.',
};
