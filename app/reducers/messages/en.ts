import { Lang } from '../locale-reducer';

export const ENGLISH_TRANSLATION = {
  lang: 'en' as Lang,
  messages: {
    'lightbox.of': 'of',
    'lightbox.image': 'image',
    'lightbox.images': 'images',
    'login.logInGoogle': 'Sign in with Google',
    'patientPanel.header': 'Patient Panel',
    'patientPanel.addPatient': 'Add Patient',
    'patientPanel.firstName': 'First Name',
    'patientPanel.lastName': 'Last Name',
    'patientPanel.age': 'Age',
    'patientPanel.location': 'Location',
    'patientPanel.joinedAt': 'Patient Joined',
    'patientPanel.engagedAt': 'Last Update',
    'patient.dateOfBirth': 'Date of birth',
    'patient.language': 'Preferred language',
    'patient.location': 'Location',
    'patient.joinedAt': 'Patient since',
    'patient.tasks': 'Tasks',
    'patient.timeline': 'Timeline',
    'patient.threeSixty': '360° View',
    'patient.map': 'MAP',
    'patient.context': 'Context',
    'patient.activity': 'Activity',
    'patient.submitProgressNote': 'Sign and Submit',
    'patient.activeCarePlan': 'Active',
    'patient.inactiveCarePlan': 'Inactive',
    'patient.carePlanSuggestions': 'Suggestions',
    'patient.cbhNumber': 'CBH MRN#',
    'patient.patientInfo': 'Patient Info',
    'patient.createdPopupHeading': 'successfully enrolled',
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
    'forms.optional': 'optional',
    'forms.declined': 'Declined',
    'forms.yes': 'Yes',
    'forms.no': 'No',
    'forms.clickHere': 'click here',
    'dateInfo.created': 'Created:',
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
    'patientInfo.jumpTo': 'Jump to:',
    'patientInfo.saveChanges': 'Save changes',
    'patientInfo.demographicInfo': 'Demographic information',
    'patientInfo.contactInfo': 'Contact information',
    'patientInfo.insuranceInfo': 'Insurance information',
    'patientMap.addGoal': 'Add a new goal',
    'patientMap.addTask': 'Add a task',
    'patientMap.nextUp': 'Next Up',
    'patientMap.emptyNextUpHeader': 'There are no Next Up concerns for this patient',
    'patientMap.emptyNextUpDetail':
      'Add concerns here that the patient and the care team do not want to focus on right now but would like to keep track of',
    'patientSearch.address': 'Home address',
    'patientSearch.dateOfBirth': 'Date of birth',
    'patientSearch.memberId': 'Member ID',
    'patientSearch.name': 'Patient name',
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
    'patientSearch.status': 'Status',
    'header.settings': 'Settings',
    'header.search': 'Search',
    'header.patients': 'Patients',
    'header.tasks': 'Tasks',
    'header.logOut': 'Logout',
    'header.builder': 'Builder',
    'header.manager': 'Manager',
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
    'riskAreaGroup.title': 'Enter domain title',
    'riskAreaAssessment.cancel': 'Cancel',
    'riskAreaAssessment.administer': 'Administer tools',
    'riskAreaAssessment.save': 'Save updates',
    'riskAreaAssessment.start': 'Start assessment',
    'riskAreaAssessment.resultsTitle': 'New Care Plan Suggestions',
    'riskAreaAssessment.resultsBody':
      "Based on the results of this assessment, the following have been recommended as additions to the patient's care plan.",
    'settings.heading': 'Settings',
    'tasks.assignedToPlaceholder': 'Assign to',
    'tasks.patientGoalPlaceholder': 'Patient goal',
    'tasks.listView': 'Tasks',
    'tasks.createTask': 'Create a new task',
    'tasks.notifications': 'Notifications',
    'tasks.noTasks': 'No Tasks',
    'taskCreate.addTask': 'Add a task',
    'taskCreate.assignee': 'Assign task to:',
    'taskCreate.cancel': 'Cancel',
    'taskCreate.concern': 'Concern:',
    'taskCreate.description': 'Enter task description:',
    'taskCreate.descriptionPlaceholder': 'Enter task description...',
    'taskCreate.detail': 'Complete this form to add a task to this goal',
    'taskCreate.dueAt': 'Due date:',
    'taskCreate.goal': 'Goal:',
    'taskCreate.priority': 'Task priority:',
    'taskCreate.submit': 'Add task',
    'taskCreate.title': 'Enter task title:',
    'taskCreate.titlePlaceholder': 'Enter task title...',
    'taskComment.activity': 'Activity and comments',
    'taskComment.error': 'Error adding comment',
    'taskDelete.cancel': 'Cancel',
    'taskDelete.confirm': 'Yes, delete',
    'taskDelete.title': 'Are you sure you want to delete this task?',
    'taskDelete.titleError': 'Error deleting task.',
    'taskDelete.body': "Deleting this task will completely remove it from this patient's record.",
    'taskDelete.bodyError': 'Please try again.',
    'taskDescription.empty': 'Click to add a task description...',
    'task.assign': 'Assign Task:',
    'task.due': 'Due',
    'task.followers': 'Followers of this task:',
    'task.opened': 'Opened',
    'task.noDueDate': 'No due date',
    'task.priority': 'Task priority:',
    'taskPriority.low': 'Low priority',
    'taskPriority.medium': 'Medium priority',
    'taskPriority.high': 'High priority',
    'taskPriority.select': 'Select priority',
    'threeSixty.automated': 'Automated Assessments:',
    'threeSixty.automatedDetail': 'Automated Assessments',
    'threeSixty.automatedEmpty': 'There are no automated assessments on record',
    'threeSixty.back': 'Back to 360',
    'threeSixty.history': 'History',
    'threeSixty.initialAssessment': 'Initial Assessment:',
    'threeSixty.manual': 'Manual Assessments:',
    'threeSixty.manualDetail': 'Manual Assessments',
    'threeSixty.manualEmpty': 'There are no manual assessments on record',
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
    'progressNote.updateMap': 'Update MAP',
    'progressNote.update360': 'Update 360',
    'progressNote.administerTool': 'Administer tool',
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
    'carePlanSuggestions.seeSuggestions': 'See Suggestions',
    'riskAdjustmentType.inactive': 'inactive',
    'riskAdjustmentType.increment': 'increment',
    'riskAdjustmentType.forceHighRisk': 'force high risk',
    'riskAdjustmentType.selectRiskAdjustmentType': 'Select risk adjustment type',
    'builder.createConcern': 'Create Concern',
    'builder.createAssessment': 'Create Assessment',
    'builder.createQuestion': 'Create Question',
    'builder.createGoal': 'Create Goal',
    'builder.createProgressNoteTemplate': 'Create Progress Note Template',
    'builder.createScreeningTool': 'Create Screening Tool',
    'manager.inviteUser': 'Invite User',
  },
};
