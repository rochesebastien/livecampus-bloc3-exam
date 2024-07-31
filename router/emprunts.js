const express = require('express');
const router = express.Router();
const db = require('./../services/database');

router.get('/salut', (req, res) => {
    res.json({ message: 'Hello emprunt!' });
});



// emprunt a book
router.post('/', (req, res) => {
    const { userId, bookId } = req.body;

    const emprunt = {
        id_utilisateur: userId,
        id_livre: bookId,
        date_emprunt: new Date(),
        date_retour_prevue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
    };

    db.query('INSERT INTO emprunts SET ?', emprunt, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        db.query('UPDATE livres SET statut = ? WHERE id = ?', ['emprunté', bookId], (error) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            res.status(201).json(emprunt);
        });
    });
});

// emprunt history
router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;
    const sql = `
        SELECT emprunts.*, livres.titre, livres.auteur, livres.date_publication, livres.isbn, livres.description, livres.statut, livres.photo_url
        FROM emprunts
        INNER JOIN livres ON emprunts.id_livre = livres.id
        WHERE emprunts.id_utilisateur = ? AND emprunts.date_retour_effective IS NULL
    `;
    db.query(sql, [user_id], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(results);
    });
});

// return a book
router.put('/return/:empruntId', (req, res) => {
    const { empruntId } = req.params;
    db.query('UPDATE emprunts SET date_retour_effective = ? WHERE id_emprunt = ?', [new Date(), empruntId], (error) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        db.query('SELECT * FROM emprunts WHERE id_emprunt = ?', [empruntId], (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            const emprunt = results[0];
            db.query('UPDATE livres SET statut = ? WHERE id = ?', ['disponible', emprunt.id_livre], (error) => {
                if (error) {
                    console.error('Database query error:', error);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                res.json(emprunt);
            });
        });
    });
});

module.exports = router;