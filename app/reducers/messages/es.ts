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
    'patient.medicareId': 'ID de Medicare',
    'patient.patientInfo': 'Información del Paciente',
    'patient.newProgressNote': 'New progress note',
    'patient.newQuickCallNote': '+ Nota de llamada rápida',
    'patient.selectProgressNoteType': 'Select encounter type:',
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
    'careTeam.slack': 'Mensaje de Slack',
    'careTeam.call': 'Llamar al teléfono',
    'careTeam.text': 'Envía un mensaje de texto',
    'careTeam.email': 'Enviar un correo electrónico',
    'careTeam.profile': 'Ir al perfil',
    'concernStats.created': 'Creado:',
    'concernStats.goals': 'Metas:',
    'concernStats.lastUpdated': 'Última actualización:',
    'concernStats.tasks': 'Tareas:',
    'forms.optional': 'opcional',
    'forms.declined': 'Rechazado',
    'forms.yes': 'Sí',
    'forms.no': 'No',
    'forms.clickHere': 'haga clic aquí',
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
    'insuranceForm.insuranceType': 'Tipo de seguro',
    'insuranceForm.insuranceTypePlaceholder': 'Seleccione el tipo de seguro',
    'insuranceForm.policyHolderRelationship': 'Paciente con el asegurado',
    'insuranceForm.policyHolderRelationshipPlaceholder': 'Seleccione quien tiene la póliza',
    'insuranceForm.memberId': 'Identificación de miembro',
    'insuranceForm.policyGroupNumber': 'Número de grupo de políticas',
    'insuranceForm.issueDate': 'Fecha de asunto',
    'insuranceForm.expirationDate': 'Fecha de caducidad',
    'patientInfo.jumpTo': 'Salta a:',
    'patientInfo.saveChanges': 'Guardar cambios',
    'patientInfo.demographicInfo': 'Información demográfica',
    'patientInfo.contactInfo': 'Información del contacto',
    'patientInfo.insuranceInfo': 'Información del seguro',
    'patientMap.addGoal': 'Agrega un nuevo objetivo',
    'patientMap.addTask': 'Agregar tarea',
    'patientMap.nextUp': 'El Siguiente',
    'patientMap.emptyNextUpHeader': 'No hay preocupaciones Siguientes para este paciente',
    /* tslint:disable:max-line-length */
    'patientMap.emptyNextUpDetail':
      'Agregue preocupaciones aquí que el paciente y el equipo de atención no quieren enfocarse en este momento, pero le gustaría hacer un seguimiento de',
    /* tslint:enable:max-line-length */
    'header.settings': 'Ajustes',
    'header.search': 'Buscar',
    'header.patients': 'Pacientes',
    'header.tasks': 'Tareas',
    'header.logOut': 'Cerrar sesión',
    'header.builder': 'Builder',
    'header.manager': 'Manager',
    'settings.heading': 'Ajustes',
    'tasks.assignedToPlaceholder': 'Asignar a',
    'tasks.patientGoalPlaceholder': 'Objetivo del paciente',
    'tasks.listView': 'Tareas',
    'tasks.calendar': 'Calendario',
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
    'taskComment.activity': 'Actividad y comentarios',
    'taskComment.error': 'Error al agregar comentario',
    'notifications.leftPane': 'Panel izquierdo',
    'notifications.noNotifications': 'Sin Notificaciones',
    'notification.time': 'Hora',
    'quickCallForm.title': 'Nota de llamada rápida',
    'quickCallForm.submit': 'Guardar llamada',
    'quickCallForm.inboundCall': 'Llamada entrante',
    'quickCallForm.outboundCall': 'Llamada saliente',
    'quickCallForm.startTime': '¿A qué hora fue la llamada?',
    'quickCallForm.callRecipient': '¿Con quién fue la llamada?',
    'quickCallForm.wasSuccessful': '¿Pudiste hablar con ellos?',
    'quickCallForm.reason': '¿Cuál fue el motivo de la llamada?',
    'quickCallForm.summary': 'Proporcione notas adicionales sobre la llamada aquí …',
  },
};
