import { FormEvent, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';

export function Home() {
	const history = useHistory();
	const { user, signInWithGoogle } = useAuth();
	const [roomCode, setRoomCode] = useState('');

	async function handleCreateRoom() {
		if (!user) {
			await signInWithGoogle();
		}

		history.push('/rooms/new');
	}

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault();

		if (roomCode.trim() === '') {
			return;
		}

		const roomRef = await database.ref(`rooms/${roomCode}`).get();

		if (!roomRef.exists()) {
			alert('Room does not exists.');
			return;
		}

		if (roomRef.val().endedAt) {
			alert('Room was closed.')
			return;
		}

		history.push(`/rooms/${roomCode}`);
	}

	return (
		<div id="page-auth">
			<aside>
				<img src={illustrationImg} alt="Illustration symbolizing questions and answers" />
				<strong>Create live question answering rooms</strong>
				<p>Ask your audience questions in real time</p>
			</aside>
			<main>
				<div className="main-content">
					<img src={logoImg} alt="Letmeask" />
					<button onClick={handleCreateRoom} className="create-room">
						<img src={googleIconImg} alt="Google logo" />
						Crie your room with Google
					</button>
					<div className="separator">or enter a room</div>
					<form onSubmit={handleJoinRoom}>
						<input
							type="text"
							placeholder="Enter room code"
							onChange={event => setRoomCode(event.target.value)}
							value={roomCode}
						/>
						<Button type="submit">
							Join the room
						</Button>
					</form>
				</div>
			</main>
		</div>
	)
}