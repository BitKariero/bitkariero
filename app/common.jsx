export const tabs = [
  {key: 'identity', label: 'Identity', icon: 'user'},
  {key: 'records', label: 'Records', icon: 'file text outline'},
  {key: 'approval-queue', label: 'Approval queue', icon: 'hourglass outline'},
  {key: 'resume', label: 'Résumé', icon: 'signup'},
];

export const recordTypes = [
  {key: 'reference', value: 'reference', text: 'Reference'},
  {key: 'certificate', value: 'certificate', text: 'Certificate'},
  {key: 'diploma', value: 'diploma', text: 'Diploma'},
];

export const identityFields = {
  name: {key: 'name', label: 'Name', icon: '', shownInHeader: true},
  shortdesc: {key: 'shortdesc', label: '', icon: '', shownInHeader: true},
  birthdate: {key: 'birthdate', label: 'Birth date', icon: 'calendar'},
  email: {key: 'email', label:' E-mail', icon: 'mail outline'},
  longdesc: {key: 'longdesc', label: 'Description', icon: 'info circle'},
};

export const identityDisplayOrder = [
  'name', 'shortdesc', 'birthdate', 'email', 'longdesc'
];
