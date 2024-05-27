import React, { useState, useEffect } from 'react';
import './WordLibrarySection.css'
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export default function WordLibrarySection() {
	const [words, setWords] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [itemsPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [editingWordId, setEditingWordId] = useState(null);
	const [newText, setNewText] = useState('');
	const [searchText] = useState('');
	const [showCreateInput, setShowCreateInput] = useState(false);
	const [newTextToTranslate, setNewTextToTranslate] = useState('');
	const [newTranslation, setNewTranslation] = useState('');
	const [newLanguage, setNewLanguage] = useState('');
	const [setTranslations] = useState([]);
	const [setLanguages] = useState([]);

	const handleTextChange = (e) => {
		setNewTextToTranslate(e.target.value);
	};

	const handleTranslationChange = (e) => {
		setNewTranslation(e.target.value);
	};

	const handleLanguageChange = (e) => {
		setNewLanguage(e.target.value);
	};

	const createNewWord = async () => {
		try {
			const textResponse = await fetch('http://localhost:8080/api/texts/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					textToTranslate: newTextToTranslate,
					translations: [
						{
							translatedText: newTranslation
						}
					],
					languages: [
						{
							name: newLanguage
						}
					]
				}),
			});
			const newText = await textResponse.json();
			setWords([...words, newText]);
			setShowCreateInput(false);
		} catch (error) {
			console.error('Error:', error);
		}
	};
	useEffect(() => {
		const fetchData = async () => {
			try {
				const textResponse = await fetch(
					`http://localhost:8080/api/texts?page=${currentPage + 1}&limit=${itemsPerPage}&search=${searchText}`
				);
				const textToTranslateData = await textResponse.json();
				setWords(textToTranslateData.content);
				setTotalPages(textToTranslateData.totalPages);

				const translationResponse = await fetch(
					`http://localhost:8080/api/translations?page=${currentPage + 1}&limit=${itemsPerPage}&search=${searchText}`
				);
				const translationData = await translationResponse.json();
				setTranslations(translationData.content);

				const languageResponse = await fetch(
					`http://localhost:8080/api/languages?page=${currentPage + 1}&limit=${itemsPerPage}&search=${searchText}`
				);
				const languageData = await languageResponse.json();
				setLanguages(languageData.content);
			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchData();
	}, [currentPage, itemsPerPage, searchText]);

	const goToPreviousPage = () => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1);
		}
	};

	const goToPage = (page) => {
		setCurrentPage(page);
	};

	const goToNextPage = () => {
		if (currentPage < totalPages - 1) {
			setCurrentPage(currentPage + 1);
		}
	};

	const deleteWord = async (wordId) => {
		try {
			await fetch(`http://localhost:8080/api/texts/delete/byId/${wordId}`, {
				method: 'DELETE',
			});
			setWords(words.filter((word) => word.id !== wordId));
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const editWord = async (wordId) => {
		setEditingWordId(wordId);
		const word = words.find((w) => w.id === wordId);
		setNewText(word.textToTranslate);
	};

	const saveEditedWord = async () => {
		if (editingWordId === null) return;

		try {
			const response = await fetch(`http://localhost:8080/api/texts/change?textId=${editingWordId}&text=${newText}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ textToTranslate: newText }),
			});

			if (response.ok) {
				const updatedWords = words.map((word) =>
					word.id === editingWordId ? { ...word, text: newText } : word
				);
				setWords(updatedWords);
				setEditingWordId(null);
				setNewText('');
			} else {
				console.error('Error updating word:', await response.json());
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<section style={{ backgroundColor: '#fafafa', padding: '30px' }}>
			<div style={{ display: 'flex', marginBottom: '24px' }}>
				<button
					style={{
						marginLeft: 'auto',
				marginRight: 'auto',
				width: '12em',
				padding: '8px 16px',
				backgroundColor: '#333',
				color: '#fff',
				border: 'none',
				borderRadius: '4px',
				cursor: 'pointer',
					}}
				onClick={() => setShowCreateInput(!showCreateInput)}
				>
				Create new text
			</button>
		</div>
			{
		showCreateInput && (
			<div className="inputContainer">
				<h1 style={{ fontSize: '24px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
					Create text constructor
				</h1>
				<input
					type="text"
					value={newTextToTranslate}
					onChange={handleTextChange}
					placeholder="Enter text"
					style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
				/>
				<input
					type="text"
					value={newTranslation}
					onChange={handleTranslationChange}
					placeholder="Enter translation"
					style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
				/>
				<input
					type="text"
					value={newLanguage}
					onChange={handleLanguageChange}
					placeholder="Enter language"
					style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
				/>
				<button onClick={createNewWord} style={{
					padding: '8px 16px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
					textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
				}}>
					Create
				</button>
			</div>
		)
	}
	<div style={{
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: '24px',
		position: 'sticky',
		top: '0',
	}}>
		<a className="pageLink" onClick={goToPreviousPage} disabled={currentPage === 0}>&#8249;</a>

		{[...Array(totalPages).keys()].map(page => (
			<a key={page}
				className={currentPage === page ? "currentPage" : "pageLink"}
				onClick={() => goToPage(page)}
				style={{ backgroundColor: currentPage === page ? '#BBB' : '#fff', }}>{page + 1}</a>
		))}

		<a className="pageLink" onClick={goToNextPage} disabled={currentPage === totalPages - 1}>&#8250;</a>
	</div>
	{
		words.map((word) => (
			<div
				key={word.id}
				style={{
					backgroundColor: '#ffffff',
					border: '1px solid #e0e0e0',
					borderRadius: '8px',
					boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
					padding: '16px',
					marginBottom: '16px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				{editingWordId === word.id ? (
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<input
							type="text"
							value={newText}
							onChange={(e) => setNewText(e.target.value)}
							style={{
								flex: '1',
								padding: '8px 12px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								fontSize: '16px'
							}}
						/>
						<button
							style={{
								backgroundColor: '#007bff',
								color: '#fff',
								border: 'none',
								borderRadius: '4px',
								padding: '8px 16px',
								cursor: 'pointer'
							}}
							onClick={saveEditedWord}
						>
							save
						</button>
					</div>
				) : (
					<div>
						{word.textToTranslate && (
							<h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#333333', maxWidth: '600px', overflowWrap: 'break-word' }}>
								{word.textToTranslate}
							</h4>
						)}
						{word.translations && (
							<p style={{ fontSize: '14px', color: '#616161', marginBottom: '4px' }}>
								Translations: {word.translations.map((translation) => translation.translatedText).join(' ')}
							</p>
						)}
						{word.languages && (
							<p style={{ fontSize: '14px', color: '#616161', marginBottom: '0' }}>
								Languages: {word.languages.map((lang) => lang.name).join(' ')}
							</p>
						)}
					</div>
				)}
				<div style={{ display: 'flex', gap: '8px' }}>
					<button
						style={{
							backgroundColor: '#007bff',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							padding: '8px 16px',
							cursor: 'pointer'
						}}
						onClick={() => editWord(word.id)}
					>
						<ModeEditIcon />
					</button>
					<button
						style={{
							backgroundColor: '#ff4444',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							padding: '8px 16px',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
						}}
						onClick={() => deleteWord(word.id)}
					>
						<DeleteIcon />
					</button>
				</div>
			</div>
		))
	}
		</section >
	)
}