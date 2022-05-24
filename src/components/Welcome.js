import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
	const [state, setState] = useState({
		email: '',
		password: '',
	})

	const [errors, setErrors] = useState({})

	const [loading, setLoading] = useState(true)

	const navigate = useNavigate()

	const uri = process.env.REACT_APP_API_URL

	useEffect(() => {
		setLoading(false)
			
		if(localStorage.getItem('user')) {
			setTimeout(() => {
				navigate('/pelanggan')
			})
		} 
	}, [])

	const handleChangeValue = (event) => {
		const { name, value } = event.currentTarget

		setState({
			...state,
			[name]: value
		})
	}

	const signIn = (event) => {
		event.preventDefault()

		const btn = document.getElementById('loginBtn')

		btn.setAttribute('disabled', 'disabled')

		axios.post(uri+'/login', state).then(response => {
			btn.removeAttribute('disabled')
			localStorage.setItem('user', JSON.stringify(response.data.results))
			
			navigate('/pelanggan')
		}).catch(error => {
			btn.removeAttribute('disabled')

			const { response } = error
			
			if(response) {
				const { status, data } = response
				
				if(status == 422) {
					setErrors(data.errors)
				} else {
					unknownError()
				}
			} else {
				unknownError()
			}
		})
	}

	const unknownError = () => {
		const errorNotification = document.getElementById('errorNotification')
		
		if(errorNotification) {
			errorNotification.classList.remove('hide')

			setTimeout(() => {
				errorNotification.classList.add('hide')
			}, 5000)
		}
	}

	return (
		<div>
			<div className="flex items-center justify-content-center h-screen w-full">
				{ !loading && (
					<div className="welcomeBox">
						<div className="notification is-danger hide" id="errorNotification">
							<button className="delete"></button>
							<strong>Gagal</strong> Login. Silahkan coba kembali.
						</div>

						<h1 className="bold center">Selamat datang di mini project Ronny</h1>
						<p className="center">Silahkan Login menggunakan User yang sudah di create <br /> melalui artisan db:seed di project mini API</p>
						
						<div className="mt-5">
							<form onSubmit={(event) => signIn(event)}>
								<div>
									<label className="bold">Email <span className="required">*</span></label>
									<input type="email" name="email" id="email" className="input is-normal" value={state.email || ''} onChange={handleChangeValue} />

									{	errors && errors.email ? 
										errors.email.map((value, key) => (
											<div className="invalid-feedback" key={key}>
									        	{ value }
									      	</div>
										)) : ''
									}
								</div>

								<div className="mt-5">
									<label className="bold">Password <span className="required">*</span></label>
									<input type="password" name="password" id="password" className="input is-normal" value={state.password || ''} onChange={handleChangeValue} />

									{	errors && errors.password ? 
										errors.password.map((value, key) => (
											<div className="invalid-feedback" key={key}>
									        	{ value }
									      	</div>
										)) : ''
									}
								</div>

								<div className="mt-5">
									<button className="button is-primary" id="loginBtn">Login</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Welcome