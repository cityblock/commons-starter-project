import { Lang } from '../locale-reducer';

export const SPANISH_TRANSLATION = {
  lang: 'es' as Lang,
  messages: {
    'lightbox.of': 'de',
    'lightbox.image': 'imágenes',
    'lightbox.images': 'imágenes',
    'login.logInGoogle': 'Inicia sesión con Google',
    'patientPanel.title': 'Pacientes:',
    'patientPanel.filteredTitle': 'Pacientes encontrados:',
    'patientPanel.description': 'Todos los pacientes en este grupo de cuidado',
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
    'patientFilter.age': 'Age Range',
    'patientFilter.gender': 'Gender',
    'patientFilter.language': 'Language',
    'patientFilter.zip': 'Ubicación',
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
    'patient.dateOfBirth': 'Fecha de nacimiento',
    'patient.language': 'Idioma',
    'patient.location': 'Ubicación',
    'patient.joinedAt': 'Paciente desde',
    'patient.printMap': 'Print MAP',
    'patient.tasks': 'Tareas',
    'patient.timeline': 'Timeline',
    'patient.threeSixty': 'Vista de 360°',
    'patient.map': 'PAM',
    'patient.context': 'Context',
    'patient.activity': 'Activity',
    'patient.activeCarePlan': 'Activo',
    'patient.inactiveCarePlan': 'Inactivo',
    'patient.carePlanSuggestions': 'Sugerencias',
    'patient.cbhNumber': 'CBH MRN#',
    'patient.medicaid': 'Medicaid',
    'patient.patientInfo': 'Información del Paciente',
    'patient.createdPopupHeading': 'Inscrito con éxito',
    'patient.createdPopupBody':
      'Continúe con su perfil de paciente o vuelva a su lista de pacientes.',
    'patient.createdPopupRoster': 'Lista de Pacientes',
    'patient.createdPopupProfile': 'Ir al perfil',
    'encounter.new': 'Registrar nuevo encuentro',
    'encounter.newReason': 'Razón del encuentro',
    'encounter.newLocation': 'Ubicación del encuentro',
    'encounter.newStartTime': 'Hora de inicio',
    'encounter.newSummary': 'Resumen del Encuentro',
    'encounter.newAttachment': 'Añadir un adjunto',
    'encounter.newCancel': 'Cancelar',
    'encounter.newSubmit': 'Enviar',
    'error.tableLoadingHeading': 'No se puede cargar tu lista',
    'error.tableLoadingMessage':
      'Perdón, algo salió mal. Intente volver a cargar la página de nuevo.',
    'error.tableLoadingButton': 'Inténtalo de nuevo',
    'error.tableLoading': 'Cargando',
    'backLink.back': 'Regreso',
    'careTeam.slack': 'Mensaje de Slack',
    'careTeam.call': 'Llamar al teléfono',
    'careTeam.text': 'Envía un mensaje de texto',
    'careTeam.email': 'Enviar un correo electrónico',
    'careTeam.profile': 'Ir al perfil',
    'computedField.flag': 'Bandera para revisión',
    'computedField.flagDetail':
      'Proporcione la siguiente información para que esta pregunta sea revisada',
    'computedField.reason': 'Motivo de la revisión:',
    'computedField.reasonDetail': 'Ingrese el motivo de la revisión...',
    'concernCreate.addConcern': 'Añadir preocupación',
    'concernCreate.cancel': 'Cancelar',
    'concernCreate.detail':
      'Completar este formulario para agregar una preocupación al MAP de este miembro',
    'concernCreate.hideAll': 'Ocultar todas las preocupaciones',
    'concernCreate.loading': 'Cargando...',
    'concernCreate.noResults': 'No se encontraron preocupaciones coincidentes.',
    'concernCreate.placeholder': 'Busque una preocupación...',
    'concernCreate.selectLabel': 'Agregue una preocupación:',
    'concernCreate.showAll': 'Ver todas las preocupaciones posibles',
    'concernCreate.submit': 'Añadir preocupación',
    'concernCreate.title': 'Agregue una preocupación',
    'concernCreate.selectConcernType': 'Seleccione un tipo de preocupación',
    'concernCreate.selectConcernTypeLabel': 'Tipo de preocupación',
    'concernDelete.description':
      'Eliminarlo lo eliminará completamente del registro de este paciente.',
    'concernDelete.menu': 'Eliminar la preocupación',
    'concernDelete.name': 'Preocupación por eliminar:',
    'concernDelete.title': '¿Estás seguro de que deseas eliminar esta preocupación?',
    'concernStats.created': 'Creado:',
    'concernStats.goals': 'Metas:',
    'concernStats.lastUpdated': 'Última actualización:',
    'concernStats.tasks': 'Tareas:',
    'concernDiagnosisCode.addCode': 'Ingrese un código ICD-10',
    'concernDiagnosisCode.addButton': 'Añadir',
    'concernDiagnosisCodes.icdTenCodes': 'ICD-10 Codes',
    'concernDiagnosisCodes.addDiagnosisCode': 'Add Diagnosis Code',
    'dashboard.countLoading': 'Cargando...',
    'dashboard.demographics': 'Falta información demográfica',
    'dashboard.emptydemographics': 'No hay pacientes con información demográfica faltante',
    'dashboard.emptyengage': 'No hay pacientes que no se hayan comprometido recientemente',
    'dashboard.emptynew': 'No hay nuevos pacientes en su equipo de atención',
    'dashboard.emptyreferrals': 'There are no patients with open CBO referrals',
    'dashboard.emptysuggestions': 'No hay pacientes con sugerencias MAP pendientes',
    'dashboard.emptytasks': 'No hay pacientes con tareas pendientes o notificaciones',
    'dashboard.emptyupdateMAP': 'No hay pacientes con un MAP desactualizado',
    'dashboard.engage': 'Sin compromiso reciente',
    'dashboard.lists': 'Listas de miembros',
    'dashboard.loading': 'Loading...',
    'dashboard.new': 'Nuevo para su equipo de cuidado',
    'dashboard.notifications': 'Notificaciones',
    'dashboard.referrals': 'Open CBO referrals',
    'dashboard.suggestions': 'Sugerencias pendientes de MAP',
    'dashboard.tasks': 'Tareas pendientes y notificaciones',
    'dashboard.tasksDue': 'Tareas pendientes',
    'dashboard.updateMAP': 'MAP desactualizado',
    'forms.optional': 'opcional',
    'forms.declined': 'Rechazado',
    'forms.yes': 'Sí',
    'forms.no': 'No',
    'forms.clickHere': 'haga clic aquí',
    'dateInfo.created': 'Creado:',
    'dateInfo.due': 'Debido:',
    'dateInfo.nullDate': 'Desconocido',
    'dateInfo.updated': 'Actualizado:',
    'demographicsForm.dateOfBirth': 'Fecha de nacimiento',
    'demographicsForm.firstName': 'Nombre de pila',
    'demographicsForm.middleName': 'Segundo nombre',
    'demographicsForm.lastName': 'Apellido',
    'demographicsForm.maritalStatus': 'Estado civil',
    'demographicsForm.maritalStatusPlaceholder': 'Seleccione estado',
    'demographicsForm.language': 'Idioma',
    'demographicsForm.languagePlaceholder': 'Seleccione idioma',
    'demographicsForm.gender': 'Género',
    'demographicsForm.genderPlaceholder': 'Seleccione género',
    'demographicsForm.race': 'Raza',
    'demographicsForm.racePlaceholder': 'Seleccione raza',
    'demographicsForm.ssn': 'Número de seguridad social',
    'demographicsForm.zip': 'Código postal',
    'contactForm.email': 'Enviar un correo electrónico',
    'contactForm.homePhone': 'Número de teléfono de casa',
    'contactForm.mobilePhone': 'Número de teléfono de móvil',
    'contactForm.consentToText': '¿El paciente acepta ser contactado vía texto?',
    'contactForm.consentToPhone': '¿El paciente acepta ser contactado por teléfono?',
    'contactForm.readConsentStatement': 'Leer declaración de consentimiento al paciente:',
    'editableText.default': 'Click here to enter text...',
    'screeningTool.submit': 'Submit',
    'screeningTool.resultsTitle': 'New Care Plan Suggestions',
    'screeningTool.resultsBody':
      "Based on the results of this tool, the following have been recommended as additions to the patient's care plan.",
    'goalCreate.addGoal': 'Agrega un objetivo',
    'goalCreate.back': 'Regresa',
    'goalCreate.cancel': 'Cancelar',
    'goalCreate.custom': 'Escribe un nuevo objetivo',
    'goalCreate.detail':
      'Elija de una lista de objetivos o escriba un objetivo personalizado para el MAP de este miembro',
    'goalCreate.goalAdded': 'Objetivo agregado:',
    'goalCreate.hideAll': 'Ocultar lista de objetivos',
    'goalCreate.loading': 'Cargando',
    'goalCreate.noResults':
      'No se encontraron objetivos coincidentes. Agregar como un objetivo personalizado.',
    'goalCreate.search': 'Busque un objetivo o escriba un objetivo personalizado...',
    'goalCreate.selectGoal': 'Seleccionar objetivo',
    'goalCreate.selectLabel': 'Agrega un objetivo:',
    'goalCreate.showAll': 'Ver lista de objetivos',
    'goalCreate.submit': 'Agregar objetivo',
    'goalCreate.submitWithTasks': 'Hecho',
    'goalCreate.suggestedTasks': 'Tareas sugeridas:',
    'goalCreate.suggestionsDetail':
      'Con base en esta adición al objetivo, se han recomendado las siguientes sugerencias para este Plan de acción para miembros. Debe aceptar o rechazar estas sugerencias antes de continuar.',
    'goalCreate.suggestionsTitle': 'Nuevas sugerencias MAP',
    'goalCreate.templates': 'Todos los demás objetivos',
    'goalCreate.title': 'Ingresa el título del objetivo:',
    'goalCreate.titlePlaceholder': 'Ingresa el título del objetivo...',
    'goalDelete.description':
      'Eliminarlo lo eliminará completamente del registro de este paciente.',
    'goalDelete.menu': 'Eliminar Objetivo',
    'goalDelete.name': 'Objetivo para ser eliminado:',
    'goalDelete.title': '¿Estás seguro de que deseas eliminar este objetivo?',
    'history360.administered': 'Administrado por:',
    'history360.conducted': 'Conducido:',
    'history360.noRecord': 'Sin registro',
    'history360.previous': 'Puntaje anterior:',
    'insuranceForm.insuranceType': 'Tipo de seguro',
    'insuranceForm.insuranceTypePlaceholder': 'Seleccione el tipo de seguro',
    'insuranceForm.policyHolderRelationship': 'Paciente con el asegurado',
    'insuranceForm.policyHolderRelationshipPlaceholder': 'Seleccione quien tiene la póliza',
    'insuranceForm.memberId': 'Identificación de miembro',
    'insuranceForm.policyGroupNumber': 'Número de grupo de políticas',
    'insuranceForm.issueDate': 'Fecha de asunto',
    'insuranceForm.expirationDate': 'Fecha de caducidad',
    'modalButtons.cancel': 'Cancelar',
    'modalButtons.delete': 'Sí, borrar',
    'modalButtons.submit': 'Enviar',
    'patientInfo.jumpTo': 'Salta a:',
    'patientInfo.saveChanges': 'Guardar cambios',
    'patientInfo.demographicInfo': 'Información demográfica',
    'patientInfo.contactInfo': 'Información del contacto',
    'patientInfo.insuranceInfo': 'Información del seguro',
    'patientInfo.demographics': 'Demographics',
    'patientInfo.documents': 'Documents',
    'patientInfo.save': 'Save',
    'patientInfo.cancel': 'Cancel',
    'patientInfo.preferredName': 'Member prefers to be called',
    'patientInfo.gender': 'Self-identifying gender',
    'patientInfo.maritalStatus': 'Marital status',
    'patientInfo.language': 'Spoken Language',
    'patientInfo.marginal': 'Check this box if this member is either homeless or marginally housed',
    'patientInfo.addAddress': 'Add additional address',
    'patientInfo.primaryAddress': 'Primary Address',
    'patientInfo.additionalAddress': 'Additional Address',
    'patientInfo.delete': 'Delete',
    'address.city': 'City',
    'address.state': 'State',
    'address.zip': 'Zip code',
    'address.description': 'Notes about this address',
    'address.street': 'Street 1',
    'address.saveError': 'There was an error saving. Try again',
    'address.addAdditional': 'Add additional address',
    'address.addPrimary': 'Add a primary address',
    'address.editAddress': 'Edit address',
    'address.primaryAddress': 'Primary address',
    'address.additionalAddresses': 'Additional addresses',
    'address.save': 'Save',
    'address.cancel': 'Cancel',
    'basicInformation.sectionTitle': 'Basic Information',
    'coreIdentity.sectionTitle': 'Core Identity',
    'coreIdentity.title': 'Core Identifying Information',
    'coreIdentity.confirmDescription':
      'Confirm that the identifying information above is correct for this member. If anything is incorrect, flag if for review by clicking on the menu in the top right.',
    'coreIdentity.flaggedDescription':
      "This member's core identifying information has been flagged for review and is pending an update in our database.",
    'coreIdentity.firstName': 'First name',
    'coreIdentity.middleName': 'Middle name',
    'coreIdentity.lastName': 'Last name',
    'coreIdentity.dateOfBirth': 'Date of birth',
    'flaggableDisplayCard.flaggedOn': 'Flagged on',
    'flaggableDisplayCard.confirm': 'Yes, info is correct',
    'flaggableDisplayCard.flag': 'Flag for review',
    'displayCard.edit': 'Edit',
    'displayCard.delete': 'Delete',
    'patientMap.addGoal': 'Agrega un nuevo objetivo',
    'patientMap.addTask': 'Agregar tarea',
    'patientMap.nextUp': 'El Siguiente',
    'patientMap.emptyNextUpHeader': 'No hay preocupaciones Siguientes para este paciente',
    'patientMap.emptyNextUpDetail':
      'Agregue preocupaciones aquí que el paciente y el equipo de atención no quieren enfocarse en este momento, pero le gustaría hacer un seguimiento de',
    'patientTable.address': 'Dirección de casa',
    'patientTable.dateOfBirth': 'Fecha de nacimiento',
    'patientTable.memberId': 'Identificación de miembro',
    'patientTable.name': 'Nombre',
    'patientTable.status': 'Estado',
    'patientSearch.noResults': 'No hay resultados para esta búsqueda',
    'patientSearch.noResultsDetail':
      'No hay pacientes coincidentes para esta búsqueda. Verifique su ortografía o intente una nueva búsqueda.',
    'patientSearch.of': 'de',
    'patientSearch.placeholder': 'Buscar miembro...',
    'patientSearch.resultsDescription': 'miembros encontrados',
    'patientSearch.resultsDescriptionSingle': 'miembro encontrado',
    'patientSearch.resultsTitle': 'Resultados de la búsqueda:',
    'patientSearch.resultsPlaceholder': 'Busque pacientes en su equipo de atención',
    'patientSearch.search': 'Buscar',
    'patientSearch.searchDescription': 'Buscar por nombre o apellido',
    'patientSearch.searchTitle': 'Buscar miembro',
    'CBOs.address': 'Enter street address of CBO',
    'CBOs.category': 'Select category of CBO',
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
    'glassBreak.popupBody': 'Provide the following information in order to access this note',
    'glassBreak.popupTitle': 'Breaking the glass',
    'glassBreak.progressNotenote':
      'In order to access this note, you have to break the glass and provide a reason for requiring access',
    'glassBreak.progressNoteprivate': 'Private progress note',
    'glassBreak.reason': 'Reason for breaking the glass?',
    'glassBreak.selectReason': 'Select reason...',
    'header.settings': 'Ajustes',
    'header.search': 'Buscar',
    'header.patients': 'Pacientes',
    'header.tasks': 'Tareas',
    'header.logOut': 'Cerrar sesión',
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
    'riskArea.assessmentType': 'Seleccionar tipo de evaluación',
    'riskArea.automated': 'Evaluación automatizada',
    'riskArea.highRiskThreshold': 'Ingrese el umbral de alto riesgo de la evaluación',
    'riskArea.manual': 'Evaluación manual',
    'riskArea.mediumRiskThreshold': 'Ingrese el umbral de riesgo medio de evaluación',
    'riskArea.order': 'Ingresar orden de evaluación',
    'riskArea.title': 'Ingrese el título de evaluación',
    'riskAreaGroup.close': 'Cerrar',
    'riskAreaGroup.create': 'Crear Dominio',
    'riskAreaGroup.delete': 'Eliminar Dominio',
    'riskAreaGroup.deleteDetail': 'Dominio a eliminar:',
    'riskAreaGroup.deleteWarning': '¿Seguro que quieres eliminar este dominio?',
    'riskAreaGroup.empty': 'Sin Dominios',
    'riskAreaGroup.highRiskThreshold': 'Ingrese el umbral de alto riesgo del dominio',
    'riskAreaGroup.mediumRiskThreshold': 'Ingrese el umbral de riesgo medio del dominio',
    'riskArea.riskAreaGroupId': 'Seleccionar dominio',
    'riskAreaGroup.order': 'Ingresar orden de dominio',
    'riskAreaGroup.shortTitle': 'Ingrese el título corto del dominio (tabla de radar)',
    'riskAreaGroup.title': 'Ingrese el título del dominio',
    'riskAreaAssessment.administer': 'Administer tools',
    'riskAreaAssessment.save': 'Terminado',
    'riskAreaAssessment.start': 'Start assessment',
    'riskAreaAssessment.resultsTitle': 'New Care Plan Suggestions',
    'riskAreaAssessment.resultsBody':
      "Based on the results of this assessment, the following have been recommended as additions to the patient's care plan.",
    'riskAreaAssessment.cancel': 'Cancelar',
    'riskAreaAssessment.editAnswer': 'Modificar respuesta',
    'riskAreaAssessment.editModalTitle': '¿Intentando modificar esta respuesta?',
    'riskAreaAssessment.editModalBody':
      'Tiene que cambiar a "modo de edición" para modificar una respuesta',
    'select.default': 'Seleccione uno',
    'select.disabled': 'Sin respuesta previa',
    'settings.heading': 'Ajustes',
    'settings.save': 'Guardar',
    'tasks.assignedToPlaceholder': 'Asignar a',
    'tasks.patientGoalPlaceholder': 'Objetivo del paciente',
    'tasks.listView': 'Tareas',
    'tasks.notifications': 'Notificaciones',
    'tasks.createTask': 'Crear Tarea',
    'tasks.noTasks': 'Sin Tareas',
    'taskDelete.cancel': 'Cancelar',
    'taskDelete.confirm': 'Sí, eliminar',
    'taskDelete.title': '¿Seguro que quieres eliminar esta tarea?',
    'taskDelete.titleError': 'Error al eliminar la tarea.',
    'taskDelete.body':
      'Eliminar esta tarea la eliminará completamente del registro de este paciente.',
    'taskDelete.bodyError': 'Por favor intente de nuevo.',
    'taskDescription.empty': 'Haga clic para agregar una descripción de la tarea...',
    'taskDescription.emptyCBO': 'Click to add a referral note...',
    'taskDescription.emptyCBOAction': 'Add additional information to generate a CBO referral form',
    'task.assign': 'Asignar Tarea:',
    'task.CBO': 'Community based organization:',
    'task.CBOAddInfo': 'Add information',
    'task.CBOAddTitle': 'Add information to CBO Referral',
    'task.CBOAddDescription':
      'Add additional information to generate a CBO referral form for this member',
    'task.CBOacknowledgedAt': 'Referral acknowledged by CBO on:',
    'task.CBOsentAt': 'Fax was successfully sent on:',
    'task.CBODateRequired': 'Date required',
    'task.concern': 'Concern:',
    'task.due': 'Debido',
    'task.followers': 'Seguidores de esta tarea:',
    'task.goal': 'Goal:',
    'task.opened': 'Abrió',
    'task.noDueDate': 'Sin fecha',
    'task.priority': 'Prioridad de la tarea:',
    'taskPriority.low': 'Baja prioridad',
    'taskPriority.medium': 'Media prioridad',
    'taskPriority.high': 'Alta prioridad',
    'taskPriority.select': 'Seleccionar prioridad',
    'taskCreate.addTask': 'Añadir una tarea',
    'taskCreate.allCBOs': 'Link to map of CBOs',
    'taskCreate.assignee': 'Asignar tarea a:',
    'taskCreate.cancel': 'Cancelar',
    'taskCreate.CBO': 'Select which CBO:',
    'taskCreate.CBOCategory': 'Select a category:',
    'taskCreate.CBOName': 'Enter the name of the CBO',
    'taskCreate.CBOReferral': 'CBO Referral',
    'taskCreate.CBOUrl': 'Add the CBO URL here',
    'taskCreate.completeReferral': 'Complete referral by:',
    'taskCreate.concern': 'Preocupación:',
    'taskCreate.description': 'Introduzca la descripción de la tarea:',
    'taskCreate.descriptionPlaceholder': 'Introduzca la descripción de la tarea...',
    'taskCreate.detail': 'Complete este formulario para agregar una tarea a este objetivo',
    'taskCreate.dueAt': 'Fecha de vencimiento:',
    'taskCreate.general': 'General',
    'taskCreate.goal': 'Gol:',
    'taskCreate.noteDetail': 'Enter note that will printed on the form...',
    'taskCreate.otherCBO': 'Other',
    'taskCreate.priority': 'Prioridad de tarea:',
    'taskCreate.referralNote': 'Referral note:',
    'taskCreate.selectCBO': 'Select a specific CBO...',
    'taskCreate.selectType': 'Select task type...',
    'taskCreate.submit': 'Agregar tarea',
    'taskCreate.title': 'Introduzca el título de la tarea:',
    'taskCreate.titlePlaceholder': 'Introduzca el título de la tarea...',
    'taskCreate.type': 'Select task type:',
    'taskComment.activity': 'Actividad y comentarios',
    'taskComment.error': 'Error al agregar comentario',
    'textarea.default': 'Ingrese respuesta...',
    'textarea.disabled': 'Sin respuesta previa',
    'notifications.leftPane': 'Panel izquierdo',
    'threeSixty.automated': 'Evaluaciones automatizadas:',
    'threeSixty.automatedDetail': 'Evaluaciones automatizadas',
    'threeSixty.automatedEmpty': 'No hay evaluaciones automatizadas en el registro',
    'threeSixty.back': 'Volver a 360',
    'threeSixty.history': 'Historia',
    'threeSixty.historyEmpty': 'No se han administrado herramientas de detección a este paciente',
    'threeSixty.initialAssessment': 'Evaluación inicial:',
    'threeSixty.manual': 'Evaluaciones manuales:',
    'threeSixty.manualDetail': 'Evaluaciones manuales',
    'threeSixty.never': 'No presentado',
    'threeSixty.manualEmpty': 'No hay evaluaciones manuales en el registro',
    'threeSixty.noAssessments': 'No hay evaluaciones registradas',
    'threeSixty.notCompleted': 'El miembro no ha completado esta evaluación.',
    'threeSixty.notCompletedShort': 'Sin completar',
    'threeSixty.summary': 'Resumen del paciente',
    'notifications.noNotifications': 'Sin Notificaciones',
    'notification.time': 'Hora',
    'progressNote.new': 'Nueva nota de progreso',
    'progressNote.progressNotes': 'Nota de Progreso',
    'progressNote.selectType': 'Seleccione el tipo de nota de progreso:',
    'progressNote.selectTime': 'Seleccione el tiempo de la nota de progreso:',
    'progressNote.selectLocation': 'Seleccione la ubicación de la nota de progreso:',
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
    'progressNote.mapSuggestions': 'MAP Suggestions',
    'progressNote.newConcerns': 'New Concerns: ',
    'progressNote.newGoals': 'New Goals: ',
    'progressNote.newTasks': 'New Tasks: ',
    'progressNote.screeningToolResults': 'Results',
    'progressNote.close': 'Close',
    'progressNote.emptyDetail': 'Future encounters with this patient will be displayed here',
    'progressNote.emptyHeader': 'No encounter history for this patient',
    'quickCallNote.new': '+ Nota de llamada rápida',
    'quickCallForm.title': 'Nota de llamada rápida',
    'quickCallForm.submit': 'Guardar llamada',
    'quickCallForm.inboundCall': 'Llamada entrante',
    'quickCallForm.outboundCall': 'Llamada saliente',
    'quickCallForm.startTime': '¿A qué hora fue la llamada?',
    'quickCallForm.callRecipient': '¿Con quién fue la llamada?',
    'quickCallForm.wasSuccessful': '¿Pudiste hablar con ellos?',
    'quickCallForm.reason': '¿Cuál fue el motivo de la llamada?',
    'quickCallForm.summary': 'Proporcione notas adicionales sobre la llamada aquí …',
    'computedField.create': 'Crear campo computado',
    'computedFieldCreate.createLabelPlaceholder': 'Ingresar una etiqueta',
    'computedFieldCreate.createDataTypeLabel': 'Seleccione un tipo de datos',
    'computedFieldCreate.cancel': 'Cancelar',
    'computedField.confirmDelete': 'Sí, borrar',
    'question.selectComputedField': 'Establecer el campo calculado',
    'question.notComputedField': 'No es un campo computado',
    'question.selectApplicable': 'Seleccione un tipo aplicable si (¡requerido!)',
    'question.applicableOneTrue': 'Una verdad',
    'question.applicableAllTrue': 'Todo cierto',
    'question.selectAnswerType': 'Seleccione un tipo de respuesta (¡obligatorio!)',
    'question.answerTypeDropdown': 'Desplegable',
    'question.answerTypeRadio': 'Radio',
    'question.answerTypeFreeText': 'Texto libre',
    'question.answerTypeMultiselect': 'Selección múltiple',
    'question.selectHasOtherTextAnswer': '¿Debería esta pregunta tener una "otra" respuesta?',
    'question.hasOtherTextAnswerTrue': 'Sí',
    'question.hasOtherTextAnswerFalse': 'No',
    'questionConditionCreate.selectAnswer': 'Seleccionar respuesta',
    'carePlanSuggestions.seeSuggestions': 'See Suggestions',
    'riskAdjustmentType.inactive': 'inactivo',
    'riskAdjustmentType.increment': 'incremento',
    'riskAdjustmentType.forceHighRisk': 'forzar alto riesgo',
    'riskAdjustmentType.selectRiskAdjustmentType': 'Seleccione el tipo de ajuste de riesgo',
    'builder.createConcern': 'Create Concern',
    'builder.createAssessment': 'Create Assessment',
    'builder.createQuestion': 'Create Question',
    'builder.createGoal': 'Create Goal',
    'builder.createProgressNoteTemplate': 'Create Progress Note Template',
    'builder.createScreeningTool': 'Create Screening Tool',
    'builder.domains': 'Domains',
    'builder.assessments': 'Assessments',
    'builder.questions': 'Questions',
    'builder.concerns': 'Concerns',
    'builder.goals': 'Goals',
    'builder.tools': 'Tools',
    'builder.patientLists': 'Patient Lists',
    'builder.CBOs': 'CBOs',
    'builder.progressNoteTemplates': 'Progress Note Templates',
    'builder.computedFields': 'Computed Fields',
    'manager.inviteUser': 'Invite User',
    'stateSelect.default': 'Select state...',
    'select.loading': 'Loading...',
    'ageRange.years': 'años',
    'ageRange.under': 'y menor',
    'ageRange.over': 'y mayor',
    'ageRange.placeholder': 'Select age range...',
    'gender.placeholder': 'Select gender...',
    'gender.male': 'Male',
    'gender.female': 'Female',
    'gender.transgender': 'Transgender',
    'gender.nonbinary': 'Non-binary',
    'language.placeholder': 'Select Language',
    'careWorkerSelect.physician': 'Physicians',
    'careWorkerSelect.nurseCareManager': 'Nurses',
    'careWorkerSelect.healthCoach': 'Health Coaches',
    'careWorkerSelect.placeholder': 'Select the care worker...',
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
  },
};
