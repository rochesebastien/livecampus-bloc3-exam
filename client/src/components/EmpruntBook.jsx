import { useState, useEffect } from 'react';

const EmpruntBook = () => {
    const [availableBooks, setAvailableBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [message, setMessage] = useState('');
    const base = import.meta.env.VITE_BASE_API

    useEffect(() => {
        const fetchAvailableBooks = async () => {
            try {
                const response = await fetch(base + 'api/books', {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                // filter on status === 'disponible'
                const filtered_data = data.filter(book => book.statut === 'disponible');
                setAvailableBooks(filtered_data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };
        fetchAvailableBooks();
    }, []);

    const handleEmprunt = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(base + 'api/emprunts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookId: selectedBookId, 'userId' : localStorage.getItem('userId') }),
                credentials: 'include'
            });
            if (response.ok) {
                console.log(response.json())
                setMessage('Livre emprunté avec succès');
            } else {
                const data = await response.json();
                setMessage(data.message || 'Erreur lors de l\'emprunt');
            }
        } catch (error) {
            setMessage('Erreur lors de l\'emprunt');
        }
    };

    return (
        <div>
            <form onSubmit={handleEmprunt}>
                <label htmlFor="bookId">Sélectionnez un livre dispo à emprunter:</label>
                <select
                    id="bookId"
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    required
                >
                    <option value="">-- Sélectionnez un livre --</option>
                    {availableBooks.map((book) => (
                        <option key={book.id} value={book.id}>
                            {book.titre} - {book.auteur}
                        </option>
                    ))}
                </select>
                <button type="submit">Emprunter</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EmpruntBook;