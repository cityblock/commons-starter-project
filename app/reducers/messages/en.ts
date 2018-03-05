import { Lang } from '../locale-reducer';

export const ENGLISH_TRANSLATION = {
  lang: 'en' as Lang,
  messages: {
    'lightbox.of': 'of',
    'lightbox.image': 'image',
    'lightbox.images': 'images',
    'login.logInGoogle': 'Sign in with Google',
    'idlePopup.heading': "Looks like you're idle",
    'idlePopup.body': "Click either of the options or you'll be automatically logged out",
    'idlePopup.cancel': 'Log out',
    'idlePopup.stayLoggedIn': 'Keep me logged in',
    'patientPanel.title': 'Members:',
    'patientPanel.filteredTitle': 'Members found:',
    'patientPanel.description': 'All members on this care team',
    'patientPanel.filteredBy': 'Filtered by',
    'patientPanel.filter': 'Filter',
    'patientPanel.assignMembers': 'Assign Members',
    'patientPanel.resultsPlaceholder': 'No patients on your care team.',
    'patientPanel.noResults': 'No members found',
    'patientPanel.noResultsDetail':
      'No members found based on the filters applied. Please adjust your filters and try again.',
    'patientFilter.title': 'Filter Panel',
    'patientFilter.cancel': 'Cancel',
    'patientFilter.apply': 'Apply',
    'patientFilter.age': 'Age',
    'patientFilter.gender': 'Gender',
    'patientFilter.language': 'Language',
    'patientFilter.zip': 'Location',
    'patientFiler.zipPlaceholder': 'Search by zip code',
    'patientFilter.careWorkerId': 'Assigned to a care worker',
    'patientFilter.insurance': 'Insurance type',
    'patientFilter.inNetwork': 'Is their primary doctor in-network',
    'patientFilter.yes': 'Yes',
    'patientFilter.no': 'No',
    'patientAssignModal.title': 'Assign members to care worker',
    'patientAssignModal.description': 'Select which care team to assign these members to.',
    'patientAssignModal.assign': 'Assign members',
    'patientAssignModal.cancel': 'Cancel',
    'patientAssignModal.select': 'Select a care worker',
    'patientAssignModal.done': 'Done',
    'patientAssignModal.assignSuccessTitle': 'Members successfully assigned',
    'patientAssignModal.assignSuccessDetailPlural':
      'members have been successfully assigned to the following care worker',
    'patientAssignModal.assignSuccessDetailSingular':
      'member has been successfully assigned to the following care worker',
    'patient.dateOfBirth': 'Date of birth',
    'patient.language': 'Preferred language',
    'patient.location': 'Location',
    'patient.joinedAt': 'Patient since',
    'patient.printMap': 'Print MAP',
    'patient.tasks': 'Tasks',
    'patient.timeline': 'Timeline',
    'patient.threeSixty': '360° View',
    'patient.map': 'MAP',
    'patient.context': 'Context',
    'patient.activity': 'Activity',
    'patient.submitProgressNote': 'Sign and Submit',
    'patient.activeCarePlan': 'Active',
    'patient.inactiveCarePlan': 'Inactive',
    'patient.medicaid': 'Medicaid',
    'patient.carePlanSuggestions': 'Suggestions',
    'patient.cbhNumber': 'CBH MRN#',
    'patient.patientInfo': 'Member Info',
    'patient.patientTeam': 'Team',
    'patient.createdPopupHeading': 'successfully enrolled',
    'patient.addToCarePlan': 'Add to care plan',
    'patient.createdPopupBody':
      'Continue to their patient profile or go back to your patient roster.',
    'patient.createdPopupRoster': 'Patient Roster',
    'patient.createdPopupProfile': 'Go to profile',
    'encounter.new': 'Record new encounter',
    'encounter.newReason': 'Encounter reason',
    'encounter.newLocation': 'Location of encounter',
    'encounter.newStartTime': 'Start time',
    'encounter.newSummary': 'Encounter summary',
    'encounter.newAttachment': 'Add attachment',
    'encounter.newCancel': 'Cancel',
    'encounter.newSubmit': 'Submit',
    'error.tableLoadingHeading': 'Unable to load your roster',
    'error.tableLoadingMessage':
      'Sorry, something went wrong. Please try reloading the page again.',
    'error.tableLoadingButton': 'Try Again',
    'error.tableLoading': 'Loading',
    'backLink.back': 'Back',
    'careTeam.slack': 'Message on Slack',
    'careTeam.email': 'Send an email',
    'computedField.flag': 'Flag for review',
    'computedField.flagDetail':
      'Provide the following information for this question to be reviewed',
    'computedField.reason': 'Reason for review:',
    'computedField.reasonDetail': 'Enter the reason for review...',
    'concernCreate.addConcern': 'Add concern',
    'concernCreate.cancel': 'Cancel',
    'concernCreate.detail': "Complete this form to add a concern to this member's MAP",
    'concernCreate.hideAll': 'Hide all concerns',
    'concernCreate.loading': 'Loading...',
    'concernCreate.noResults': 'No matching concerns found.',
    'concernCreate.placeholder': 'Search for a concern...',
    'concernCreate.selectLabel': 'Add a concern:',
    'concernCreate.showAll': 'See all possible concerns',
    'concernCreate.submit': 'Add concern',
    'concernCreate.title': 'Add a concern',
    'concernCreate.selectConcernType': 'Select a concern type',
    'concernCreate.selectConcernTypeLabel': 'Concern type',
    'concernDelete.description':
      'Deleting it will completely remove it from this patient’s record.',
    'concernDelete.menu': 'Delete Concern',
    'concernDelete.name': 'Concern to be deleted:',
    'concernDelete.title': 'Are you sure you want to delete this concern?',
    'concernStats.created': 'Created:',
    'concernStats.goals': 'Goals:',
    'concernStats.lastUpdated': 'Last update:',
    'concernStats.tasks': 'Tasks:',
    'concernDiagnosisCode.addCode': 'Enter an ICD-10 code',
    'concernDiagnosisCode.addButton': 'Add',
    'concernDiagnosisCodes.icdTenCodes': 'ICD-10 Codes',
    'concernDiagnosisCodes.addDiagnosisCode': 'Add Diagnosis Code',
    'dashboard.countLoading': 'Loading',
    'dashboard.demographics': 'Missing demographic info',
    'dashboard.emptydemographics': 'There are no patients with missing demographic information',
    'dashboard.emptyengage': 'There are no patients that have not been engaged recently',
    'dashboard.emptynew': 'There are no new patients on your care team',
    'dashboard.emptyreferrals': 'There are no patients with open CBO referrals',
    'dashboard.emptysuggestions': 'There are no patients with pending MAP suggestions',
    'dashboard.emptytasks': 'There are no patients with tasks due or notifications',
    'dashboard.emptyupdateMAP': 'There are no patients with an out-of-date MAP',
    'dashboard.engage': 'No recent engagement',
    'dashboard.lists': 'Member lists',
    'dashboard.loading': 'Loading...',
    'dashboard.new': 'New to your care team',
    'dashboard.notifications': 'Notifications',
    'dashboard.referrals': 'Open CBO referrals',
    'dashboard.suggestions': 'Pending MAP suggestions',
    'dashboard.tasks': 'Tasks due and notifications',
    'dashboard.tasksDue': 'Tasks due',
    'dashboard.updateMAP': 'Out-of-date MAP',
    'forms.optional': 'optional',
    'forms.declined': 'Declined',
    'forms.yes': 'Yes',
    'forms.no': 'No',
    'forms.clickHere': 'click here',
    'dateInfo.created': 'Created:',
    'dateInfo.due': 'Due:',
    'dateInfo.nullDate': 'Unknown',
    'dateInfo.suggested': 'Suggested:',
    'dateInfo.updated': 'Updated:',
    'demographicsForm.dateOfBirth': 'Date of birth',
    'demographicsForm.firstName': 'First name',
    'demographicsForm.middleName': 'Middle name',
    'demographicsForm.lastName': 'Last name',
    'demographicsForm.maritalStatus': 'Marital status',
    'demographicsForm.maritalStatusPlaceholder': 'Select status',
    'demographicsForm.language': 'Preferred language',
    'demographicsForm.languagePlaceholder': 'Select language',
    'demographicsForm.gender': 'Gender',
    'demographicsForm.genderPlaceholder': 'Select gender',
    'demographicsForm.race': 'Race',
    'demographicsForm.racePlaceholder': 'Select race',
    'demographicsForm.ssn': 'Social security number',
    'demographicsForm.zip': 'Zip code',
    'contactForm.email': 'Email address',
    'contactForm.homePhone': 'Home phone number',
    'contactForm.mobilePhone': 'Mobile phone number',
    'contactForm.consentToText': 'Does the patient consent to being contacted via text?',
    'contactForm.consentToPhone': 'Does the patient consent to being contacted via phone?',
    'contactForm.readConsentStatement': 'Read consent statement to patient:',
    'editableText.default': 'Click here to enter text...',
    'screeningTool.submit': 'Submit',
    'screeningTool.resultsTitle': 'New Care Plan Suggestions',
    'screeningTool.resultsBody':
      "Based on the results of this tool, the following have been recommended as additions to the patient's care plan.",
    'goalCreate.addGoal': 'Add a goal',
    'goalCreate.back': 'Back',
    'goalCreate.cancel': 'Cancel',
    'goalCreate.custom': 'Write a new goal',
    'goalCreate.detail': "Choose from a list of goals or write a custom goal for this member's MAP",
    'goalCreate.goalAdded': 'Goal added:',
    'goalCreate.hideAll': 'Hide list of goals',
    'goalCreate.loading': 'Loading...',
    'goalCreate.noResults': 'No matching goals found. Adding as a custom goal.',
    'goalCreate.search': 'Search for a goal or write a custom goal...',
    'goalCreate.selectGoal': 'Select goal',
    'goalCreate.selectLabel': 'Add a goal:',
    'goalCreate.showAll': 'See list of goals',
    'goalCreate.submit': 'Add goal',
    'goalCreate.submitWithTasks': 'Done',
    'goalCreate.suggestedTasks': 'Suggested tasks:',
    'goalCreate.suggestionsDetail':
      'Based on this goal addition, the following suggestions have been recommended to this Member Action Plan. You must accept or dismiss these suggestions before continuing.',
    'goalCreate.suggestionsTitle': 'New MAP suggestions',
    'goalCreate.templates': 'All other goals',
    'goalCreate.title': 'Enter goal title:',
    'goalCreate.titlePlaceholder': 'Enter goal title...',
    'goalDelete.description': 'Deleting it will completely remove it from this patient’s record.',
    'goalDelete.menu': 'Delete Goal',
    'goalDelete.name': 'Goal to be deleted:',
    'goalDelete.title': 'Are you sure you want to delete this goal?',
    'history360.administered': 'Administered by:',
    'history360.conducted': 'Conducted:',
    'history360.noRecord': 'No record',
    'history360.previous': 'Previous score:',
    'insuranceForm.insuranceType': 'Insurance type',
    'insuranceForm.insuranceTypePlaceholder': 'Select insurance type',
    'insuranceForm.policyHolderRelationship': 'Patient relationship to policyholder',
    'insuranceForm.policyHolderRelationshipPlaceholder': 'Select relationship',
    'insuranceForm.memberId': 'Member ID',
    'insuranceForm.policyGroupNumber': 'Policy group number',
    'insuranceForm.issueDate': 'Issue date',
    'insuranceForm.expirationDate': 'Expiration date',
    'modalButtons.cancel': 'Cancel',
    'modalButtons.delete': 'Yes, delete',
    'modalButtons.submit': 'Submit',
    'patientInfo.demographicInfo': 'Demographic information',
    'patientInfo.contactInfo': 'Contact information',
    'patientInfo.insuranceInfo': 'Insurance information',
    'patientInfo.demographics': 'Demographics',
    'patientInfo.documents': 'Documents',
    'patientInfo.save': 'Save',
    'patientInfo.saveSuccess': 'Changes saved.',
    'patientInfo.saveError': 'Error saving.',
    'patientInfo.tryAgain': 'Please try again.',
    'patientInfo.preferredName': 'Member prefers to be called',
    'patientInfo.gender': 'Self-identifying gender',
    'patientInfo.sexAtBirth': 'Sex at birth',
    'patientInfo.maritalStatus': 'Marital status',
    'patientInfo.language': 'Spoken Language',
    'patientInfo.marginal': 'Check this box if this member is either homeless or marginally housed',
    'patientInfo.delete': 'Delete',
    'patientInfo.primary': 'Primary',
    'address.city': 'City',
    'address.state': 'State',
    'address.zip': 'Zip code',
    'address.description': 'Notes about this address',
    'address.street1': 'Street 1',
    'address.saveError': 'There was an error saving. Try again',
    'address.addAdditional': 'Add additional address',
    'address.addPrimary': 'Add a primary address',
    'address.editAddress': 'Edit address',
    'address.primaryAddress': 'Primary address',
    'address.additionalAddress': 'Additional address',
    'address.addresses': 'Addresses',
    'address.save': 'Save',
    'address.cancel': 'Cancel',
    'address.isPrimary': 'Is this their primary address?',
    'basicInfo.sectionTitle': 'Basic Information',
    'coreIdentity.sectionTitle': 'Core Identity',
    'coreIdentity.title': 'Key Identifying Information',
    'coreIdentity.confirmDescription':
      'Confirm that the identifying information above is correct for this member. If anything is incorrect, flag if for review by clicking on the menu in the top right.',
    'coreIdentity.flaggedDescription':
      "This member's core identifying information has been flagged for review and is pending an update in our database.",
    'coreIdentity.firstName': 'First name',
    'coreIdentity.middleName': 'Middle name',
    'coreIdentity.lastName': 'Last name',
    'coreIdentity.dateOfBirth': 'Date of birth',
    'coreIdentity.placeholder': 'Select a field name...',
    'contactInfo.sectionTitle': 'Contact Information',
    'contactInfo.hasEmail': '',
    'contactInfo.canReceiveTexts':
      'Is the member able and willing to receive text messages from their care team?',
    'contactInfo.canReceiveCalls':
      'Is the member able and willing to receive phone calls from their care team?',
    'contactInfo.preferredContactMethod': 'What is the best way to contact this member?',
    'email.hasEmail': 'This member does not have an email address',
    'email.description': 'Notes about this email address',
    'email.emailAddress': 'Email address',
    'email.saveError': 'There was an error saving. Try again',
    'email.addAdditional': 'Add additional email address',
    'email.addPrimary': 'Add a primary email address',
    'email.editEmail': 'Edit email address',
    'email.emailAddresses': 'Email addresses',
    'email.primaryEmail': 'Primary email address',
    'email.additionalEmail': 'Additional email address',
    'email.save': 'Save',
    'email.cancel': 'Cancel',
    'email.isPrimary': 'Is this their primary email?',
    'phone.description': 'Notes about this phone number',
    'phone.phoneNumbers': 'Phone numbers',
    'phone.type': 'Type of phone',
    'phone.saveError': 'There was an error saving. Try again',
    'phone.addAdditional': 'Add additional phone numbers',
    'phone.addPrimary': 'Add a primary phone number',
    'phone.editPhone': 'Edit phone number',
    'phone.phoneNumber': 'Phone number',
    'phone.primaryPhone': 'Primary phone number',
    'phone.additionalPhone': 'Additional phone number',
    'phone.save': 'Save',
    'phone.cancel': 'Cancel',
    'phone.isPrimary': 'Is this their primary phone number?',
    'phone.work': 'Work',
    'phone.mobile': 'Mobile',
    'phone.other': 'Other',
    'phone.home': 'Home',
    'flaggingModal.title': 'Flag for review',
    'flaggingModal.description': 'Provide the following information for this field to be reviewed',
    'flaggingModal.cancel': 'Cancel',
    'flaggingModal.submit': 'Submit for review',
    'flaggingModal.fieldName': 'Which field is incorrect?',
    'flaggingModal.correctValue': 'What is the correct information?',
    'flaggingModal.notes': 'Notes for review:',
    'flaggingModal.notesPlaceholder': 'Include any additional info for the review...',
    'flaggableDisplayCard.flaggedOn': 'Flagged on',
    'flaggableDisplayCard.confirm': 'Yes, info is correct',
    'flaggableDisplayCard.flag': 'Flag for review',
    'displayCard.edit': 'Edit',
    'displayCard.delete': 'Delete',
    'patientMap.addGoal': 'Add a new goal',
    'patientMap.addTask': 'Add a task',
    'patientMap.nextUp': 'Next Up',
    'patientMap.emptyNextUpHeader': 'There are no Next Up concerns for this patient',
    'patientMap.emptyNextUpDetail':
      'Add concerns here that the patient and the care team do not want to focus on right now but would like to keep track of',
    'patientTable.address': 'Home address',
    'patientTable.dateOfBirth': 'Date of birth',
    'patientTable.memberId': 'Member ID',
    'patientTable.name': 'Patient name',
    'patientTable.status': 'Status',
    'patientSearch.noResults': 'No results for this search',
    'patientSearch.noResultsDetail':
      'No matching patients for this search. Please check your spelling or try a new search.',
    'patientSearch.of': 'of',
    'patientSearch.placeholder': 'Search for member...',
    'patientSearch.resultsDescription': 'members found',
    'patientSearch.resultsDescriptionSingle': 'member found',
    'patientSearch.resultsTitle': 'Search results:',
    'patientSearch.resultsPlaceholder': 'Search for patients on your care team',
    'patientSearch.search': 'Search',
    'patientSearch.searchDescription': 'Search by first name or last name',
    'patientSearch.searchTitle': 'Search for member',
    'CBOs.address': 'Enter street address of CBO',
    'CBOs.category': 'Select a category of CBO...',
    'CBOs.city': 'Enter city of CBO',
    'CBOs.close': 'Close',
    'CBOs.create': 'Create CBO',
    'CBOs.delete': 'Delete CBO',
    'CBOs.deleteDetail': 'CBO to be deleted:',
    'CBOs.deleteWarning': 'Are you sure you want to delete this CBO?',
    'CBOs.empty': 'No CBOs',
    'CBOs.fax': 'Enter CBO fax number (if available)',
    'CBOs.name': 'Enter CBO name',
    'CBOs.phone': 'Enter CBO phone number',
    'CBOs.url': 'Enter link to CBO website',
    'CBOs.zip': 'Enter CBO zip code',
    'CBO.fax': 'Fax',
    'CBO.noFax': 'Not available',
    'CBO.phone': 'Tel',
    'CBO.viewForm': 'View referral form',
    'glassBreak.breakGlass': 'Break the glass',
    'glassBreak.inputNote': 'Write a reason for breaking the glass...',
    'glassBreak.note': 'Additional note:',
    'glassBreak.optAdmin': 'Needed for administrative reasons',
    'glassBreak.optEmergency': 'Needed for emergency care',
    'glassBreak.optError': 'Believe I was restricted in error',
    'glassBreak.optOther': 'Other',
    'glassBreak.optRoutine': 'Needed for routine care',
    'glassBreak.patientnote':
      'In order to access this member’s profile, you have to break the glass and provide a reason for requiring access',
    'glassBreak.patientprivate': 'Private profile:',
    'glassBreak.popupBody': 'Fill out the form below to access this information',
    'glassBreak.popupTitle': 'Breaking the glass',
    'glassBreak.progressNotenote':
      'In order to access this note, you have to break the glass and provide a reason for requiring access',
    'glassBreak.progressNoteprivate': 'Private progress note',
    'glassBreak.reason': 'Reason for breaking the glass?',
    'glassBreak.selectReason': 'Select reason...',
    'header.settings': 'Settings',
    'header.search': 'Search',
    'header.patients': 'Members',
    'header.tasks': 'Tasks',
    'header.logOut': 'Logout',
    'header.builder': 'Builder',
    'header.manager': 'Manager',
    'patientLists.answerId': 'Enter answer id for patient list',
    'patientLists.close': 'Close',
    'patientLists.create': 'Create Patient List',
    'patientLists.delete': 'Delete Patient List',
    'patientLists.deleteDetail': 'Patient list to be deleted:',
    'patientLists.deleteWarning': 'Are you sure you want to delete this patient list?',
    'patientLists.empty': 'No Patient Lists',
    'patientLists.order': 'Enter patient list order',
    'patientLists.title': 'Enter patient list title',
    'riskArea.assessmentType': 'Select assessment type',
    'riskArea.automated': 'Automated Assessment',
    'riskArea.highRiskThreshold': 'Enter assessment high risk threshold',
    'riskArea.manual': 'Manual Assessment',
    'riskArea.mediumRiskThreshold': 'Enter assessment medium risk threshold',
    'riskArea.order': 'Enter assessment order',
    'riskArea.title': 'Enter assessment title',
    'riskAreaGroup.close': 'Close',
    'riskAreaGroup.create': 'Create Domain',
    'riskAreaGroup.delete': 'Delete Domain',
    'riskAreaGroup.deleteDetail': 'Domain to be deleted:',
    'riskAreaGroup.deleteWarning': 'Are you sure you want to delete this domain?',
    'riskAreaGroup.empty': 'No Domains',
    'riskAreaGroup.highRiskThreshold': 'Enter domain high risk threshold',
    'riskAreaGroup.mediumRiskThreshold': 'Enter domain medium risk threshold',
    'riskArea.riskAreaGroupId': 'Select Domain',
    'riskAreaGroup.order': 'Enter domain order',
    'riskAreaGroup.shortTitle': 'Enter short domain title (radar chart)',
    'riskAreaGroup.title': 'Enter domain title',
    'riskAreaAssessment.administer': 'Administer tools',
    'riskAreaAssessment.save': 'Done',
    'riskAreaAssessment.start': 'Edit answers',
    'riskAreaAssessment.resultsTitle': 'New Care Plan Suggestions',
    'riskAreaAssessment.resultsBody':
      "Based on the results of this assessment, the following have been recommended as additions to the patient's care plan.",
    'riskAreaAssessment.cancel': 'Cancel',
    'riskAreaAssessment.editAnswer': 'Edit answer',
    'riskAreaAssessment.editModalTitle': 'Trying to update this answer?',
    'riskAreaAssessment.editModalBody':
      'In order to update members answers you need to enter "Edit mode" for this assessment.',
    'select.default': 'Select one',
    'select.disabled': 'No previous response',
    'settings.heading': 'Settings',
    'settings.phone': 'Phone',
    'settings.locale': 'Locale',
    'settings.enterPhone': 'Enter phone number',
    'settings.save': 'Save',
    'tasks.assignedToPlaceholder': 'Assign to',
    'tasks.patientGoalPlaceholder': 'Patient goal',
    'tasks.listView': 'Tasks',
    'tasks.createTask': 'Create a new task',
    'tasks.notifications': 'Notifications',
    'tasks.noTasks': 'No Tasks',
    'taskCreate.addTask': 'Add a task',
    'taskCreate.allCBOs': 'Link to map of CBOs',
    'taskCreate.assignee': 'Assign task to:',
    'taskCreate.cancel': 'Cancel',
    'taskCreate.CBO': 'Select which CBO:',
    'taskCreate.CBOCategory': 'Select a category:',
    'taskCreate.CBOName': 'Enter the name of the CBO',
    'taskCreate.CBOReferral': 'CBO Referral',
    'taskCreate.CBOUrl': 'Add the CBO URL here',
    'taskCreate.completeReferral': 'Complete referral by:',
    'taskCreate.concern': 'Concern:',
    'taskCreate.description': 'Enter task description:',
    'taskCreate.descriptionPlaceholder': 'Enter task description...',
    'taskCreate.detail': 'Complete this form to add a task to this goal',
    'taskCreate.dueAt': 'Due date:',
    'taskCreate.general': 'General',
    'taskCreate.goal': 'Goal:',
    'taskCreate.noteDetail': 'Enter note that will printed on the form...',
    'taskCreate.otherCBO': 'Other',
    'taskCreate.priority': 'Task priority:',
    'taskCreate.referralNote': 'Referral note:',
    'taskCreate.selectCBO': 'Select a specific CBO...',
    'taskCreate.selectType': 'Select task type...',
    'taskCreate.submit': 'Add task',
    'taskCreate.title': 'Enter task title:',
    'taskCreate.titlePlaceholder': 'Enter task title...',
    'taskCreate.type': 'Select task type:',
    'taskComment.activity': 'Activity and comments',
    'taskComment.error': 'Error adding comment',
    'taskDelete.cancel': 'Cancel',
    'taskDelete.confirm': 'Yes, delete',
    'taskDelete.title': 'Are you sure you want to delete this task?',
    'taskDelete.titleError': 'Error deleting task.',
    'taskDelete.body': "Deleting this task will completely remove it from this patient's record.",
    'taskDelete.bodyError': 'Please try again.',
    'taskDescription.empty': 'Click to add a task description...',
    'taskDescription.emptyCBO': 'Click to add a referral note...',
    'taskDescription.emptyCBOAction': 'Add additional information to generate a CBO referral form',
    'task.assign': 'Assign Task:',
    'task.CBO': 'Community based organization:',
    'task.CBOAddInfo': 'Add information',
    'task.CBOAddTitle': 'Add Information to CBO Referral',
    'task.CBOAddDescription':
      'Add additional information to generate a CBO referral form for this member',
    'task.CBOacknowledgedAt': 'Referral acknowledged by CBO on:',
    'task.CBOsentAt': 'Fax was successfully sent on:',
    'task.CBODateRequired': 'Date required',
    'task.concern': 'Concern:',
    'task.due': 'Due',
    'task.followers': 'Followers of this task:',
    'task.goal': 'Goal:',
    'task.opened': 'Opened',
    'task.noDueDate': 'No due date',
    'task.priority': 'Task priority:',
    'taskPriority.low': 'Low priority',
    'taskPriority.medium': 'Medium priority',
    'taskPriority.high': 'High priority',
    'taskPriority.select': 'Select priority',
    'textarea.default': 'Enter response...',
    'textarea.disabled': 'No previous response',
    'threeSixty.automated': 'Automated Assessments:',
    'threeSixty.automatedDetail': 'Automated Assessments',
    'threeSixty.automatedEmpty': 'There are no automated assessments on record',
    'threeSixty.back': 'Back to 360',
    'threeSixty.history': 'History',
    'threeSixty.historyEmpty': 'No screening tools have been administered to this patient',
    'threeSixty.initialAssessment': 'Initial Assessment:',
    'threeSixty.manual': 'Manual Assessments:',
    'threeSixty.manualDetail': 'Manual Assessments',
    'threeSixty.manualEmpty': 'There are no manual assessments on record',
    'threeSixty.never': 'Not submitted',
    'threeSixty.noAssessments': 'No assessments on record',
    'threeSixty.notCompleted': 'Member has not completed this assessment.',
    'threeSixty.notCompletedShort': 'Not completed',
    'threeSixty.summary': 'Patient Summary',
    'notifications.leftPane': 'Left Pane',
    'notifications.noNotifications': 'No Notifications',
    'notification.time': 'Time',
    'user.createdAt': 'Created At',
    'user.editedAt': 'Last edited',
    'user.delete': 'Delete User',
    'progressNote.new': 'New progress note',
    'progressNote.progressNotes': 'Progress Note',
    'progressNote.selectType': 'Select progress note type:',
    'progressNote.selectTime': 'Select progress note time:',
    'progressNote.selectLocation': 'Select progress note location:',
    'progressNote.contextAndPlan': 'Context and plan',
    'progressNote.memberConcernAndObservation': 'Member concern and observation',
    'progressNote.numberMapUpdates': 'MAP updates',
    'progressNote.goToActivity': 'go to activity',
    'progressNote.updateMap': 'Update MAP',
    'progressNote.update360': 'Update 360',
    'progressNote.administerTool': 'Administer tool',
    'progressNote.doesRequireCosignature': 'Does this progress note require supervisor review?',
    'progressNote.selectSupervisor': 'Select supervisor:',
    'progressNote.supervisorReview': 'Supervisor Note',
    'progressNote.submitSupervisorReview': 'Submit Supervisor Review',
    'progressNote.pendingReview': 'Pending review',
    'progressNote.reviewed': 'Reviewed',
    'progressNote.emptyEvents': 'No Activity',
    'progressNote.mapSuggestions': 'MAP Suggestions',
    'progressNote.newConcerns': 'New Concerns: ',
    'progressNote.newGoals': 'New Goals: ',
    'progressNote.newTasks': 'New Tasks: ',
    'progressNote.screeningToolResults': 'Results:',
    'progressNote.close': 'Close',
    'progressNote.emptyDetail': 'Future encounters with this patient will be displayed here',
    'progressNote.emptyHeader': 'No encounter history for this patient',
    'quickCallNote.new': '+ Quick call note',
    'quickCallForm.title': 'Quick call note',
    'quickCallForm.submit': 'Save call',
    'quickCallForm.inboundCall': 'Inbound call',
    'quickCallForm.outboundCall': 'Outbound call',
    'quickCallForm.startTime': 'What time was the call?',
    'quickCallForm.callRecipient': 'Who was the call with?',
    'quickCallForm.wasSuccessful': 'Were you able to speak with them?',
    'quickCallForm.reason': 'What was the reason for the call?',
    'quickCallForm.summary': 'Please provide additional notes about the call here …',
    'computedField.create': 'Create Computed Field',
    'computedFieldCreate.createLabelPlaceholder': 'Enter label',
    'computedFieldCreate.createDataTypeLabel': 'Select a data type',
    'computedFieldCreate.cancel': 'Cancel',
    'computedField.confirmDelete': 'Yes, delete',
    'question.selectComputedField': 'Set computed field',
    'question.notComputedField': 'Not a computed field',
    'question.selectApplicable': 'Select an applicable if type (required!)',
    'question.applicableOneTrue': 'One true',
    'question.applicableAllTrue': 'All true',
    'question.selectAnswerType': 'Select an answer type (required!)',
    'question.answerTypeDropdown': 'Dropdown',
    'question.answerTypeRadio': 'Radio',
    'question.answerTypeFreeText': 'Free Text',
    'question.answerTypeMultiselect': 'Multiselect',
    'question.selectHasOtherTextAnswer': 'Should this question have an "other" answer?',
    'question.hasOtherTextAnswerTrue': 'Yes',
    'question.hasOtherTextAnswerFalse': 'No',
    'questionConditionCreate.selectAnswer': 'Select Answer',
    'carePlanSuggestion.computedField': 'Auto Assessment',
    'carePlanSuggestion.concern': 'Suggested Concern',
    'carePlanSuggestion.domainAssessment': 'Domain Assessment',
    'carePlanSuggestion.goal': 'Suggested Goal',
    'carePlanSuggestion.tool': 'Tool',
    'carePlanSuggestions.seeSuggestions': 'See Suggestions',
    'carePlanSuggestions.concerns': 'Suggested Concerns',
    'carePlanSuggestions.emptyBody': 'Any new suggestions will be displayed here',
    'carePlanSuggestions.emptyTitle': 'No Care Plan suggestions for this patient',
    'carePlanSuggestions.goals': 'Suggested Goals',
    'riskAdjustmentType.inactive': 'inactive',
    'riskAdjustmentType.increment': 'increment',
    'riskAdjustmentType.forceHighRisk': 'force high risk',
    'riskAdjustmentType.selectRiskAdjustmentType': 'Select risk adjustment type',
    'builder.cancel': 'Cancel',
    'builder.screeningToolTitle': 'Enter screening tool title',
    'builder.createConcern': 'Create Concern',
    'builder.createAssessment': 'Create Assessment',
    'builder.createQuestion': 'Create Question',
    'builder.createGoal': 'Create Goal',
    'builder.createProgressNoteTemplate': 'Create Progress Note Template',
    'builder.domains': 'Domains',
    'builder.assessments': 'Assessments',
    'builder.questions': 'Questions',
    'builder.concerns': 'Concerns',
    'builder.goals': 'Goals',
    'builder.tools': 'Tools',
    'builder.patientLists': 'Patient Lists',
    'builder.CBOs': 'CBOs',
    'builder.enterTaskTitle': 'Enter task title',
    'builder.enterConcernTitle': 'Enter concern title',
    'builder.enterGoalTitle': 'Enter goal title',
    'builder.enterProgressNoteTemplateTitle': 'Enter progress note template title',
    'builder.progressNoteTemplates': 'Progress Note Templates',
    'builder.computedFields': 'Computed Fields',
    'builder.enterScoreRangeDescription': 'Enter score range description',
    'builder.enterMinimumScore': 'Enter minimum score',
    'builder.enterMaxiumumScore': 'Enter maximum score',
    'builder.createScreeningTool': 'Create Screening Tool',
    'builder.displayInSummary': 'Display in summary?',
    'builder.riskAdjustmentType': 'Risk adjustment type:',
    'builder.backendValueType': 'Backend value type:',
    'builder.backendValue': 'Backend value',
    'builder.displayValue': 'Display value',
    'builder.enterSummary': 'Enter summary text',
    'builder.summaryText': 'Summary text',
    'builder.enterAnswerValue': 'Enter answer value',
    'builder.order': 'Order:',
    'builder.enterDisplayValue': 'Enter answer display value',
    'builder.enterQuestionTitle': 'Enter question title',
    'builder.enterQuestionOrder': 'Enter question order',
    'manager.inviteUser': 'Invite User',
    'manager.users': 'Users',
    'manager.cancel': 'Cancel',
    'manager.confirmDelete': 'Confirm Delete',
    'manager.invites': 'Invites',
    'manager.enterEmail': 'Enter text before @cityblock in email',
    'stateSelect.default': 'Select state',
    'select.loading': 'Loading...',
    'select.unselect': 'Unselect',
    'ageRange.years': 'years old',
    'ageRange.under': 'and under',
    'ageRange.over': 'and older',
    'ageRange.placeholder': 'Select age range',
    'gender.placeholder': 'Select gender',
    'gender.male': 'Male',
    'gender.female': 'Female',
    'gender.transgender': 'Transgender',
    'gender.nonbinary': 'Non-binary',
    'sexAtBirth.female': 'Female',
    'sexAtBirth.male': 'Male',
    'sexAtBirth.placeholder': 'Select sex at birth',
    'language.placeholder': 'Select Language',
    'careWorker.physician': 'Physicians',
    'careWorker.nurseCareManager': 'Nurses',
    'careWorker.healthCoach': 'Health Coaches',
    'careWorkerSelect.placeholder': 'Select the care worker',
    'patientIntakeChecklist.coreIdentityLabel': 'Verify core identifying info',
    'patientIntakeChecklist.coreIdentitySubtext':
      "Verify the key identifying information we collected from this member's health records.",
    'patientIntakeChecklist.coreIdentityButton': 'Verify information',
    'patientIntakeChecklist.demographicInfoLabel': 'Member demographic info',
    'patientIntakeChecklist.demographicInfoSubtext':
      "Enter the member's basic information and/or verify any information we collected from their health records.",
    'patientIntakeChecklist.demographicInfoButton': 'Add information',
    'patientIntakeChecklist.emergencyContactLabel': 'Existing care team info and emergency contact',
    'patientIntakeChecklist.emergencyContactSubtext':
      'Add any existing care team members this member had prior to Cityblock as well as at least one emergency contact.',
    'patientIntakeChecklist.emergencyContactButton': 'Add team',
    'patientIntakeChecklist.advancedDirectivesLabel': 'Advanced directives',
    'patientIntakeChecklist.advancedDirectivesSubtext':
      'Ask the member about their advanced directives and add that information to their profile.',
    'patientIntakeChecklist.advancedDirectivesButton': 'Add directives',
    'patientIntakeChecklist.consentSignedLabel': 'Collect member consents',
    'patientIntakeChecklist.consentSignedSubtext':
      'Walk the member through our consent forms and have them digitally sign each one.',
    'patientIntakeChecklist.consentSignedButton': 'Sign consents',
    'patientIntakeChecklist.photoUploadedLabel': 'Add member photo',
    'patientIntakeChecklist.photoUploadedSubtext':
      'Including a member photo will make their profile more personal.',
    'patientIntakeChecklist.photoUploadedButton': 'Add photo',
    'patientIntakeChecklist.closeChecklist': 'Close checklist',
    'patientIntakeChecklist.openChecklist': 'Open checklist',
    'patientIntakeChecklist.bannerLabel': 'Member intake incomplete',
    'patientIntakeChecklist.completed': 'Completed',
    'patientIntakeChecklist.headerText': 'Member intake checklist',
    'patientTeam.cityblockCareTeam': 'Cityblock Care Team',
    'patientTeam.externalCareTeam': 'External Care Team',
    'patientTeam.familyAndSupportTeam': 'Family & Support',
    'patientTeam.addCityblockCareTeamButton': 'Add Cityblock team member',
    'patientTeam.addExternalCareTeamButton': 'Add external team member',
    'patientTeam.addFamilyAndSupportTeamButton': 'Add family & support',
    'patientDocuments.patientConsents': 'Consent forms',
    'patientDocuments.patientAdvancedDirectives': 'Advanced Directive forms',
    'patientDocuments.cancel': 'Cancel',
    'patientDocuments.save': 'Save',
  },
};
