import {useEffect, useState} from 'react';

const ReturnBook = () => {
    const [empruntId, setEmpruntId] = useState('');
    const [emprunts, setEmprunts] = useState([]);
    const [message, setMessage] = useState('');
    const base = import.meta.env.VITE_BASE_API

    const handleReturn = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(base+`api/emprunts/return/${empruntId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                setMessage('Livre retourné avec succès');
            } else {
                const data = await response.json();
                setMessage(data.message || 'Erreur lors du retour');
            }
        } catch (error) {
            setMessage('Erreur lors du retour');
        }
    };

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
            <form onSubmit={handleReturn}>
                <label htmlFor="loanId">Emprunt à retourner : </label>
                <select
                    id="loanId"
                    value={empruntId}
                    onChange={(e) => setEmpruntId(e.target.value)}
                    required
                >
                    <option value="">Sélectionnez un emprunt</option>
                    {emprunts.map((emprunt) => (
                        <option key={emprunt.id_emprunt} value={emprunt.id_emprunt}>
                            Emprunt #{emprunt.id_emprunt}
                        </option>
                    ))}
                </select>

                <button type="submit">Retourner</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ReturnBook;