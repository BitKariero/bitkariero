export const tabs = [
  {key: 'identity', label: 'Identity', icon: 'user'},
  {key: 'records', label: 'Records', icon: 'file text outline'},
  {key: 'requests', label: 'Requests', icon: 'hourglass outline'},
  {key: 'resume', label: 'Résumé', icon: 'signup'},
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
