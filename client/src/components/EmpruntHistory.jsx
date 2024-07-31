import React, { useState, useEffect } from 'react';

const EmpruntHistory = () => {
    const [emprunts, setEmprunts] = useState([]);
    const base = import.meta.env.VITE_BASE_API

    useEffect(() => {
        const fetchEmpruntHistory = async () => {
            try {
                const userId = 1;
                const response = await fetch(base + `api/emprunts/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                setEmprunts(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        console.log(emprunts)
        fetchEmpruntHistory();
    }, []);

    return (
        <div>
            <h2>Historique des Emprunts</h2>
            <ul>
                {emprunts.length === 0 ? (
                    <p>Vous n'avez pas emprunté de livre</p>
                ) : (

                    emprunts.map((emprunt) => (
                        <li key={emprunt.id_emprunt}>
                            Emprunt numéro : {emprunt.id_emprunt},
                            Fait par l'utilisateur ; {emprunt.id_utilisateur},
                            Date de l'emprunt: {new Date(emprunt.date_emprunt).toLocaleDateString()},
                            Date de retour prévue: {new Date(emprunt.date_retour_prevue).toLocaleDateString()}
                            {emprunt.date_retour && <span>, Date de retour: {new Date(emprunt.date_retour).toLocaleDateString()}</span>}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default EmpruntHistory;