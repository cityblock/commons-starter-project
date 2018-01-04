import { Lang } from '../locale-reducer';

export const SPANISH_TRANSLATION = {
  lang: 'es' as Lang,
  messages: {
    'lightbox.of': 'de',
    'lightbox.image': 'imágenes',
    'lightbox.images': 'imágenes',
    'login.logInGoogle': 'Inicia sesión con Google',
    'patientPanel.header': 'Panel de pacientes',
    'patientPanel.addPatient': 'Añadir Paciente',
    'patientPanel.firstName': 'Nombre de pila',
    'patientPanel.lastName': 'Apellido',
    'patientPanel.age': 'Años',
    'patientPanel.location': 'Ubicación',
    'patientPanel.joinedAt': 'Paciente Unido',
    'patientPanel.engagedAt': 'Última actualización',
    'patient.dateOfBirth': 'Fecha de nacimiento',
    'patient.language': 'Idioma',
    'patient.location': 'Ubicación',
    'patient.joinedAt': 'Paciente desde',
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
    'forms.optional': 'opcional',
    'forms.declined': 'Rechazado',
    'forms.yes': 'Sí',
    'forms.no': 'No',
    'forms.clickHere': 'haga clic aquí',
    'dateInfo.created': 'Creado:',
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
    'goalCreate.loading': 'Cargando...',
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
    'patientMap.addGoal': 'Agrega un nuevo objetivo',
    'patientMap.addTask': 'Agregar tarea',
    'patientMap.nextUp': 'El Siguiente',
    'patientMap.emptyNextUpHeader': 'No hay preocupaciones Siguientes para este paciente',
    'patientMap.emptyNextUpDetail':
      'Agregue preocupaciones aquí que el paciente y el equipo de atención no quieren enfocarse en este momento, pero le gustaría hacer un seguimiento de',
    'patientSearch.address': 'Direccion de casa',
    'patientSearch.dateOfBirth': 'Fecha de nacimiento',
    'patientSearch.memberId': 'Identificación de miembro',
    'patientSearch.name': 'Nombre del paciente',
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
    'patientSearch.status': 'Estado',
    'header.settings': 'Ajustes',
    'header.search': 'Buscar',
    'header.patients': 'Pacientes',
    'header.tasks': 'Tareas',
    'header.logOut': 'Cerrar sesión',
    'header.builder': 'Builder',
    'header.manager': 'Manager',
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
    'riskAreaGroup.title': 'Ingrese el título del dominio',
    'riskAreaAssessment.cancel': 'Cancel',
    'riskAreaAssessment.administer': 'Administer tools',
    'riskAreaAssessment.save': 'Save updates',
    'riskAreaAssessment.start': 'Start assessment',
    'riskAreaAssessment.resultsTitle': 'New Care Plan Suggestions',
    'riskAreaAssessment.resultsBody':
      "Based on the results of this assessment, the following have been recommended as additions to the patient's care plan.",
    'select.default': 'Seleccione uno',
    'settings.heading': 'Ajustes',
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
    'task.assign': 'Asignar Tarea:',
    'task.due': 'Debido',
    'task.followers': 'Seguidores de esta tarea:',
    'task.opened': 'Abrió',
    'task.noDueDate': 'Sin fecha',
    'task.priority': 'Prioridad de la tarea:',
    'taskPriority.low': 'Baja prioridad',
    'taskPriority.medium': 'Media prioridad',
    'taskPriority.high': 'Alta prioridad',
    'taskPriority.select': 'Seleccionar prioridad',
    'taskCreate.addTask': 'Añadir una tarea',
    'taskCreate.assignee': 'Asignar tarea a:',
    'taskCreate.cancel': 'Cancelar',
    'taskCreate.concern': 'Preocupación:',
    'taskCreate.description': 'Introduzca la descripción de la tarea:',
    'taskCreate.descriptionPlaceholder': 'Introduzca la descripción de la tarea...',
    'taskCreate.detail': 'Complete este formulario para agregar una tarea a este objetivo',
    'taskCreate.dueAt': 'Fecha de vencimiento:',
    'taskCreate.goal': 'Gol:',
    'taskCreate.priority': 'Prioridad de tarea:',
    'taskCreate.submit': 'Agregar tarea',
    'taskCreate.title': 'Introduzca el título de la tarea:',
    'taskCreate.titlePlaceholder': 'Introduzca el título de la tarea...',
    'taskComment.activity': 'Actividad y comentarios',
    'taskComment.error': 'Error al agregar comentario',
    'notifications.leftPane': 'Panel izquierdo',
    'threeSixty.automated': 'Evaluaciones automatizadas:',
    'threeSixty.automatedDetail': 'Evaluaciones automatizadas',
    'threeSixty.automatedEmpty': 'No hay evaluaciones automatizadas en el registro',
    'threeSixty.back': 'Volver a 360',
    'threeSixty.history': 'Historia',
    'threeSixty.initialAssessment': 'Evaluación inicial:',
    'threeSixty.manual': 'Evaluaciones manuales:',
    'threeSixty.manualDetail': 'Evaluaciones manuales',
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
    'progressNote.updateMap': 'Update MAP',
    'progressNote.update360': 'Update 360',
    'progressNote.administerTool': 'Administer tool',
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
    'manager.inviteUser': 'Invite User',
  },
};
