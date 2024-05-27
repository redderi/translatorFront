import { useState } from 'react'
import './Header.css'
import Button from '../button/Button'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function Header({ active, onChange }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [dark, setDark] = useState(false)
	const [pageTitle, setPageTitle] = useState('Text Translator');

	const handlePageTitleChange = (newTitle) => {
		setPageTitle(newTitle);
	};

	function myFunction(event) {
		setIsMenuOpen(!isMenuOpen);
		event.currentTarget.classList.toggle("change");
	}
	return (
		<header style={{ backgroundColor: dark ? '#333' : '#3e6ae1' }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div className="container" onClick={myFunction}>
						<div className="bar1"></div>
						<div className="bar2"></div>
						<div className="bar3"></div>
					</div>


					{isMenuOpen && (
						<>
							<Button
								style={{ backgroundColor: '#fff', color: '#333', height: '60px' }}
								isActive={active === 'main'}
								onClick={() => {
									onChange('main');
									handlePageTitleChange('Text translator');
								}}
							>
								<h1 style={{ fontSize: '12px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
									Translator
								</h1>
							</Button>
							<Button
								style={{ backgroundColor: '#fff', color: '#333', height: '60px' }}
								isActive={active === 'wordLibrary'}
								onClick={() => {
									onChange('wordLibrary');
									handlePageTitleChange('Word library');
								}}
							>
								<h1 style={{ fontSize: '12px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
									Word library
								</h1>
							</Button>
						</>
					)}
					<h1 style={{ color: '#fff', fontSize: '36px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>{pageTitle}</h1>
				</div>
				<div>
					<Button
						isActive={dark === true}
						onClick={() => setDark(!dark)}
						style={{
							width: '50px',
							height: '50px',
							borderRadius: '50%',
							padding: '0rem 0rem',
							margin: '1rem',
							marginLeft: '2rem',
							backgroundColor: '#fff',
							color: '#333'
						}}
					>
						{dark ? <WbSunnyIcon /> : <DarkModeIcon />}
					</Button>
				</div>
			</div>
		</header>
	)
}