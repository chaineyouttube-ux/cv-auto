// Initialisation de l'application Vue
const { createApp, ref, reactive, onMounted } = Vue;

const app = createApp({
    setup() {
        // Données du CV
        const cvData = reactive({
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            address: '',
            website: '',
            linkedin: '',
            portfolio: '',
            summary: '',
            skills: [],
            experience: [],
            education: [],
            languages: [],
            interests: [],
            qualities: [],
            certifications: [],
            computerSkills: [],
            volunteer: [],
            photo: null
        });

        const loading = ref(true);
        const selectedTemplate = ref('light');

        // Nouvelle compétence à ajouter
        const newSkill = ref('');
        
        // Nouveau centre d'intérêt à ajouter
        const newInterest = ref('');
        
        // Nouvelle qualité à ajouter
        const newQuality = ref('');
        
        // Nouvelle compétence informatique à ajouter
        const newComputerSkill = ref('');

        // Charger les données sauvegardées
        const loadSavedData = () => {
            const savedData = localStorage.getItem('cvData');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    // Assigner les valeurs de manière réactive
                    cvData.fullName = parsedData.fullName || '';
                    cvData.jobTitle = parsedData.jobTitle || '';
                    cvData.email = parsedData.email || '';
                    cvData.phone = parsedData.phone || '';
                    cvData.address = parsedData.address || '';
                    cvData.summary = parsedData.summary || '';
                    cvData.photo = parsedData.photo || null;
                    
                    // Réinitialiser et remplir les tableaux
                    cvData.skills.length = 0;
                    if (parsedData.skills && Array.isArray(parsedData.skills)) {
                        cvData.skills.push(...parsedData.skills);
                    }
                    
                    cvData.experience.length = 0;
                    if (parsedData.experience && Array.isArray(parsedData.experience)) {
                        cvData.experience.push(...parsedData.experience);
                    }
                    
                    cvData.education.length = 0;
                    if (parsedData.education && Array.isArray(parsedData.education)) {
                        cvData.education.push(...parsedData.education);
                    }
                    
                    cvData.languages.length = 0;
                    if (parsedData.languages && Array.isArray(parsedData.languages)) {
                        cvData.languages.push(...parsedData.languages);
                    }
                    
                    cvData.interests.length = 0;
                    if (parsedData.interests && Array.isArray(parsedData.interests)) {
                        cvData.interests.push(...parsedData.interests);
                    }
                    
                    cvData.qualities.length = 0;
                    if (parsedData.qualities && Array.isArray(parsedData.qualities)) {
                        cvData.qualities.push(...parsedData.qualities);
                    }
                    
                    cvData.website = parsedData.website || '';
                    cvData.linkedin = parsedData.linkedin || '';
                    cvData.portfolio = parsedData.portfolio || '';
                    
                    cvData.certifications.length = 0;
                    if (parsedData.certifications && Array.isArray(parsedData.certifications)) {
                        cvData.certifications.push(...parsedData.certifications);
                    }
                    
                    cvData.computerSkills.length = 0;
                    if (parsedData.computerSkills && Array.isArray(parsedData.computerSkills)) {
                        cvData.computerSkills.push(...parsedData.computerSkills);
                    }
                    
                    cvData.volunteer.length = 0;
                    if (parsedData.volunteer && Array.isArray(parsedData.volunteer)) {
                        cvData.volunteer.push(...parsedData.volunteer);
                    }
                    
                    // Charger le modèle sauvegardé
                    if (parsedData.selectedTemplate) {
                        selectedTemplate.value = parsedData.selectedTemplate;
                    }
                } catch (e) {
                    console.error('Erreur lors du chargement des données:', e);
                }
            }
            loading.value = false;
        };

        // Fonction utilitaire pour afficher les notifications
        const showToast = (message, type = 'info') => {
            const toastEl = document.getElementById('liveToast');
            if (toastEl) {
                const toast = new bootstrap.Toast(toastEl);
                const toastBody = toastEl.querySelector('.toast-body');
                if (toastBody) {
                    toastBody.textContent = message;
                }
                toast.show();
            } else {
                alert(`${type.toUpperCase()}: ${message}`);
            }
        };

        // Gestion du téléversement de photo
        const handlePhotoUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    cvData.photo = e.target.result;
                    saveCV(false);
                };
                reader.readAsDataURL(file);
            }
        };

        // Gestion des compétences
        const addSkill = () => {
            if (newSkill.value.trim() && !cvData.skills.includes(newSkill.value.trim())) {
                cvData.skills.push(newSkill.value.trim());
                newSkill.value = '';
                saveCV(false);
            }
        };

        // Gestion des centres d'intérêt
        const addInterest = () => {
            if (newInterest.value.trim() && !cvData.interests.includes(newInterest.value.trim())) {
                cvData.interests.push(newInterest.value.trim());
                newInterest.value = '';
                saveCV(false);
            }
        };

        // Gestion des qualités
        const addQuality = () => {
            if (newQuality.value.trim() && !cvData.qualities.includes(newQuality.value.trim())) {
                cvData.qualities.push(newQuality.value.trim());
                newQuality.value = '';
                saveCV(false);
            }
        };

        // Gestion des expériences
        const addExperience = () => {
            cvData.experience.push({
                title: '',
                company: '',
                period: '',
                description: ''
            });
        };

        // Gestion des formations
        const addEducation = () => {
            cvData.education.push({
                degree: '',
                institution: '',
                year: '',
                phone: ''
            });
        };

        // Gestion des langues
        const addLanguage = () => {
            cvData.languages.push({
                name: '',
                level: ''
            });
        };

        // Gestion des certifications
        const addCertification = () => {
            cvData.certifications.push({
                name: '',
                institution: '',
                year: ''
            });
        };

        // Gestion des compétences informatiques
        const addComputerSkill = () => {
            if (newComputerSkill.value.trim() && !cvData.computerSkills.includes(newComputerSkill.value.trim())) {
                cvData.computerSkills.push(newComputerSkill.value.trim());
                newComputerSkill.value = '';
                saveCV(false);
            }
        };

        // Gestion de l'expérience bénévole
        const addVolunteer = () => {
            cvData.volunteer.push({
                organization: '',
                description: ''
            });
        };

        // Suppression d'un élément
        const removeItem = (type, index) => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                cvData[type].splice(index, 1);
                saveCV(false);
            }
        };

        // Sauvegarde des données dans le localStorage
        const saveCV = (showNotification = false) => {
            try {
                const dataToSave = JSON.parse(JSON.stringify(cvData));
                dataToSave.selectedTemplate = selectedTemplate.value;
                localStorage.setItem('cvData', JSON.stringify(dataToSave));
                if (showNotification) {
                    showToast('CV enregistré avec succès!', 'success');
                }
            } catch (e) {
                console.error('Erreur lors de la sauvegarde:', e);
                showToast('Erreur lors de la sauvegarde', 'danger');
            }
        };

        // Réinitialisation du formulaire
        const resetForm = () => {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ? Toutes les modifications non enregistrées seront perdues.')) {
                Object.keys(cvData).forEach(key => {
                    if (Array.isArray(cvData[key])) {
                        cvData[key] = [];
                    } else if (typeof cvData[key] === 'object' && cvData[key] !== null) {
                        cvData[key] = {};
                    } else {
                        cvData[key] = '';
                    }
                });
                selectedTemplate.value = 'light';
                localStorage.removeItem('cvData');
                showToast('Formulaire réinitialisé', 'info');
            }
        };

        // Charger un exemple de CV
        const loadExample = () => {
            // Réinitialiser toutes les données d'abord
            cvData.fullName = '';
            cvData.jobTitle = '';
            cvData.email = '';
            cvData.phone = '';
            cvData.address = '';
            cvData.summary = '';
            cvData.skills.length = 0;
            cvData.experience.length = 0;
            cvData.education.length = 0;
            cvData.languages.length = 0;
            cvData.interests.length = 0;
            cvData.qualities.length = 0;
            cvData.certifications.length = 0;
            cvData.computerSkills.length = 0;
            cvData.volunteer.length = 0;
            cvData.website = '';
            cvData.linkedin = '';
            cvData.portfolio = '';
            cvData.photo = null;
            
            // Charger les données d'exemple
            cvData.fullName = 'Sacha Dubois';
            cvData.jobTitle = 'Chargée de projet';
            cvData.email = 'hello@reallygreatsite.com';
            cvData.phone = '123-456-7890';
            cvData.address = '123 Anywhere St., Any City';
            cvData.summary = '';
            
            // Ajouter les compétences
            cvData.skills.push(
                'Gestion du temps',
                'Capacités d\'organisation',
                'Communication',
                'Leadership',
                'Logiciels de gestion de projet',
                'Gestion de budget'
            );
            
            // Ajouter les expériences
            cvData.experience.push(
                {
                    title: 'Chargée de Projet',
                    company: 'Really Great Company - Any City',
                    period: 'Depuis janvier 2020',
                    description: 'Elaboration du plan de projet et gestion des calendriers\nGestion des ressources et du budget\nGestion des risques (identification des risques, réaction aux imprévus)'
                },
                {
                    title: 'Assistante Chargée de Projet',
                    company: 'Really Great Company - Any City',
                    period: 'Septembre 2018 - Janvier 2020',
                    description: 'Rédaction des rapports de progression\nParticipation aux réunions de suivi de projet\nSuivi de l\'avancement des projets en collaboration avec les équipes concernées'
                },
                {
                    title: 'Stagiaire Chargée de Projet',
                    company: 'Really Great Company - Any City',
                    period: 'Février 2018 - Juin 2018',
                    description: 'Aide pour définir les objectifs et les périmètres du projet\nParticipation à l\'élaboration des plans de projet (échéanciers, jalons et livrables)'
                }
            );
            
            // Ajouter les formations
            cvData.education.push(
                {
                    degree: 'Master en Management',
                    institution: 'Really Great School - Any City',
                    year: '2016 - 2018',
                    phone: ''
                },
                {
                    degree: 'Licence en Gestion Administrative',
                    institution: 'Really Great School - Any City',
                    year: '2013 - 2016',
                    phone: ''
                }
            );
            
            // Ajouter les langues
            cvData.languages.push(
                { name: 'Anglais', level: 'Courant' },
                { name: 'Allemand', level: 'Intermédiaire' }
            );
            
            // Ajouter les centres d'intérêt
            cvData.interests.push(
                'Lecture',
                'Randonnée',
                'Gymnastique',
                'Judo'
            );
            
            // Ajouter les qualités (pour le modèle dark)
            cvData.qualities.push(
                'Créativité',
                'Capacité d\'adaptation',
                'Excellentes compétences relationnelles',
                'Esprit d\'équipe',
                'Orientation résultats'
            );
            
            cvData.website = 'www.realgreatsite.com';
            cvData.linkedin = 'linkedin.com/in/kiangraham';
            cvData.portfolio = 'Click here for my portfolio';
            
            // Ajouter les certifications
            cvData.certifications.push(
                {
                    name: 'Flight Safety Training',
                    institution: 'National Aviation Association',
                    year: '2020'
                },
                {
                    name: 'First Aid Certification',
                    institution: 'International Medical Agency',
                    year: '2020'
                }
            );
            
            // Ajouter les compétences informatiques (pour le modèle rose)
            cvData.computerSkills.push(
                'Text processor',
                'Spreadsheet',
                'Slide presentation'
            );
            
            // Ajouter l'expérience bénévole (pour le modèle rose)
            cvData.volunteer.push(
                {
                    organization: 'BORCELLE COMPANY',
                    description: 'Participation in collections to distribute in low-income schools.'
                }
            );
            
            // Sauvegarder les données
            saveCV(true);
            showToast('Exemple chargé avec succès', 'success');
        };

        // Téléchargement du CV en PDF
        const downloadPDF = () => {
            const element = document.getElementById('cv-preview');
            if (!element) {
                showToast('Impossible de trouver l\'aperçu du CV', 'danger');
                return;
            }

            const opt = {
                margin: 10,
                filename: `CV_${cvData.fullName || 'sans-nom'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    allowTaint: true
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };

            // Masquer les boutons avant la génération du PDF
            const buttons = element.querySelectorAll('button, .no-print');
            buttons.forEach(btn => btn.style.display = 'none');

            // Générer le PDF
            html2pdf()
                .set(opt)
                .from(element)
                .save()
                .then(() => {
                    // Réafficher les boutons après la génération
                    buttons.forEach(btn => btn.style.display = '');
                    showToast('CV téléchargé avec succès!', 'success');
                })
                .catch(err => {
                    console.error('Erreur lors de la génération du PDF:', err);
                    showToast('Erreur lors de la génération du PDF', 'danger');
                    buttons.forEach(btn => btn.style.display = '');
                });
        };

        // Impression du CV
        const printCV = () => {
            window.print();
        };

        // Fonction utilitaire pour la barre de progression des langues
        const getLanguageLevelWidth = (level) => {
            const levels = {
                'Débutant': '25%',
                'Intermédiaire': '50%',
                'Avancé': '75%',
                'Courant': '90%',
                'Bilingue': '95%',
                'Natif': '100%'
            };
            return levels[level] || '0%';
        };

        // Initialisation au chargement de la page
        onMounted(() => {
            // Initialiser les tooltips Bootstrap
            if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
                const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.forEach(tooltipTriggerEl => {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
            }

            // Charger les données sauvegardées
            loadSavedData();

            // Validation des champs du formulaire
            const forms = document.querySelectorAll('.needs-validation');
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        saveCV(true);
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        });

        // Exposition des données et méthodes au template
        return {
            cvData,
            loading,
            selectedTemplate,
            newSkill,
            newInterest,
            newQuality,
            newComputerSkill,
            handlePhotoUpload,
            addSkill,
            addInterest,
            addQuality,
            addComputerSkill,
            addExperience,
            addEducation,
            addLanguage,
            addCertification,
            addVolunteer,
            removeItem,
            saveCV,
            resetForm,
            loadExample,
            downloadPDF,
            printCV,
            getLanguageLevelWidth
        };
    }
});

// Démarrer l'application
app.mount('#app');

// TODO: Ajouter plus de fonctionnalités :
// - Validation des champs du formulaire
// - Gestion des erreurs améliorée
// - Prévisualisation en temps réel plus détaillée
// - Support multilingue
// - Export en plusieurs formats (DOCX, TXT)
// - Intégration avec des API de stockage cloud