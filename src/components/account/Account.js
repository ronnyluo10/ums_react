import { useEffect, useState } from 'react'
import SideBar from '../templates/SideBar.js'
import OpenNavBtn from '../templates/OpenNavBtn.js'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Account = () => {
	const uri = process.env.REACT_APP_API_URL
	const [errors, setErrors] = useState({})
	const [profile, setProfile] = useState({
		nama: '',
		email: '',
		_method: 'PUT'
	})
	const [password, setPassword] = useState({
		kata_sandi_sekarang: '',
		kata_sandi_baru: '',
		konfirmasi_kata_sandi: '',
		_method: 'PUT'
	})
	const [token, setToken] = useState('')
	
	const [user, setUser] = useState({})

	const navigate = useNavigate()

	const [errorMsg, setErrorMsg] = useState('')

	const [headers, setHeaders] = useState({})

	useEffect(() => {
		let userData = localStorage.getItem('user')

		if(userData) {
			userData = JSON.parse(userData)
			setUser(user => userData)

			setHeaders(headers => (
				{
					headers: {
						Authorization: 'Bearer '+userData.token
					}
				}
			))

			setProfile({
				...profile,
				nama: userData.user.name,
				email: userData.user.email,
			})

			setToken(userData.token)
		} else {
			navigate('/')
		}

	}, [])

	const handleChangeProfileValue = (event) => {
		const { name, value } = event.currentTarget
		
		setProfile({
			...profile,
			[name]: value
		})
	}

	const handleChangePasswordValue = (event) => {
		const { name, value } = event.currentTarget
		
		setPassword({
			...password,
			[name]: value
		})
	}

	const clearError = () => {
		if(Object.keys(errors).length > 0) {
			setErrors({})
		}
	}

	const disableButton = (id) => {
		document.getElementById(id).setAttribute('disabled', 'disabled')
	}

	const enableButton = (id) => {
		document.getElementById(id).removeAttribute('disabled')
	}

	const unknownError = (error) => {
		const { response } = error
			
		if(response) {
			const { status, data } = response
			
			if(status == 422) {
				setErrors(data.errors)
			} else {
				errorNotif()
			}
		} else {
			errorNotif()
		}
	}

	const errorNotif = () => {
		const errorNotification = document.getElementById('errorNotification')
		
		window.scrollTo(0, 0);

		setErrorMsg(errorMsg => 'Opps ada kesalahan pada server. Silahkan coba kembali.')

		if(errorNotification) {
			errorNotification.classList.remove('hide')

			setTimeout(() => {
				errorNotification.classList.add('hide')
			}, 5000)
		}
	}

	const successNotif = () => {
		window.scrollTo(0, 0);

		const successNotification = document.getElementById('successNotification')

		successNotification.classList.remove('hide')

		setTimeout(() => {
			if(successNotification)
				successNotification.classList.add('hide')
		}, 5000)
	}

	const saveProfile = (event) => {
		event.preventDefault()
		clearError()
		disableButton('saveProfile')
		
		axios.post(uri+'/akun/ubah/profil', profile, headers).then(response => {
			successNotif()
			
			localStorage.setItem('user', JSON.stringify({
				'token': token,
				'user': {
					id: user.user.id,
					name: profile.nama,
					email: profile.email,
				}
			}))

			enableButton('saveProfile')
		}).catch(error => {
			unknownError(error)

			enableButton('saveProfile')
		})
	}

	const changePassword = (event) => {
		event.preventDefault()

		clearError()
		disableButton('changePassword')
		
		axios.post(uri+'/akun/ubah/kata-sandi', password, headers).then(response => {
			successNotif()

			enableButton('changePassword')
			
			setPassword(password => ({
				kata_sandi_sekarang: '',
				kata_sandi_baru: '',
				konfirmasi_kata_sandi: '',
				_method: 'PUT',
			}))
		}).catch(error => {
			unknownError(error)

			enableButton('changePassword')
		})
	}

	const generateToken = (event) => {
		event.preventDefault()

		clearError()
		disableButton('generateToken')
		
		axios.post(uri+'/akun/generate-new-token', {}, headers).then(response => {
			successNotif()
			
			const { results } = response.data
			
			setToken(results.token)

			setHeaders(headers => (
				{
					headers: {
						Authorization: 'Bearer '+results.token
					}
				}
			))

			localStorage.setItem('user', JSON.stringify(results))

			enableButton('generateToken')
		}).catch(error => {
			console.log(error)
			unknownError(error)

			enableButton('generateToken')
		})
	}

	const logout = (event) => {
		event.preventDefault()

		disableButton('logoutBtn')

		axios.post(uri+'/logout', {}, headers).then(response => {
			enableButton('logoutBtn')

			localStorage.removeItem('user')
		
			navigate('/')
		}).catch(error => {
			unknownError(error)

			enableButton('logoutBtn')
		})
	}

	return (
		<div>
			<SideBar />

			<div id="main">
				<OpenNavBtn />

				<div className="notification is-success hide" id="successNotification">
					<button className="delete"></button>
					<strong>Berhasil</strong> simpan data
				</div>

				<div className="notification is-danger hide" id="errorNotification">
					<button className="delete"></button>
					{ errorMsg }
				</div>

				<div className="mb-5">Akun</div>

				<div className="grid grid-cols-2 bg-gray">
					<div className="pl-5 pt-5 pb-5">
						<h3 className="text-lg font-medium text-gray-900"> Informasi Profil </h3>
						<p className="mt-1 text-sm text-gray-600"> Perbarui informasi profil dan alamat email akun Anda. </p>
					</div>

					<div className="bg-white pr-5 pt-5 pb-5 pl-5 form-wrap">
						<form onSubmit={(event) => saveProfile(event)}>
							<div>
								<label className="bold">Nama <span className="required">*</span></label>
								<input type="text" name="nama" id="nama" value={profile.nama || ''} className="input is-normal" onChange={handleChangeProfileValue} />

								{ errors && errors.nama  ? 
									errors.nama.map((value, key) => 
										<div className="invalid-feedback" key={key}>
								        	{ value }
								      	</div>
									)
									: ''
								}
							</div>

							<div className="mt-5">
								<label className="bold">Email <span className="required">*</span></label>
								<input type="email" name="email" id="email" value={profile.email || ''} className="input is-normal" onChange={handleChangeProfileValue} />

								{ errors && errors.email  ? 
									errors.email.map((value, key) => 
										<div className="invalid-feedback" key={key}>
								        	{ value }
								      	</div>
									)
									: ''
								}
							</div>

							<div className="mt-5 flex justify-content-end">
								<button className="button is-primary" id="saveProfile">Simpan</button>
							</div>
						</form>
					</div>
				</div>

				<div className="grid grid-cols-2 bg-gray mt-5">
					<div className="pl-5 pt-5 pb-5">
						<h3 className="text-lg font-medium text-gray-900"> Perbarui Kata Sandi </h3>
						<p className="mt-1 text-sm text-gray-600"> Pastikan akun Anda menggunakan kata sandi acak yang panjang agar tetap aman. </p>
					</div>

					<div className="bg-white pr-5 pt-5 pb-5 pl-5 form-wrap">
						<form onSubmit={(event) => changePassword(event)}>
							<div>
								<label className="bold">Kata Sandi Sekarang <span className="required">*</span></label>
								<input type="password" name="kata_sandi_sekarang" id="kata_sandi_sekarang" className="input is-normal" value={password.kata_sandi_sekarang || ''} onChange={handleChangePasswordValue} />
								
								{ errors && errors.kata_sandi_sekarang  ? 
									errors.kata_sandi_sekarang.map((value, key) => 
										<div className="invalid-feedback" key={key}>
								        	{ value }
								      	</div>
									)
									: ''
								}
							</div>

							<div className="mt-5">
								<label className="bold">Kata Sandi Baru <span className="required">*</span></label>
								<input type="password" name="kata_sandi_baru" id="kata_sandi_baru" className="input is-normal" value={password.kata_sandi_baru || ''} onChange={handleChangePasswordValue} />

								{ errors && errors.kata_sandi_baru  ? 
									errors.kata_sandi_baru.map((value, key) => 
										<div className="invalid-feedback" key={key}>
								        	{ value }
								      	</div>
									)
									: ''
								}
							</div>

							<div className="mt-5">
								<label className="bold">Konfirmasi Kata Sandi <span className="required">*</span></label>
								<input type="password" name="konfirmasi_kata_sandi" id="konfirmasi_kata_sandi" className="input is-normal" value={password.konfirmasi_kata_sandi || ''} onChange={handleChangePasswordValue} />

								{ errors && errors.konfirmasi_kata_sandi  ? 
									errors.konfirmasi_kata_sandi.map((value, key) => 
										<div className="invalid-feedback" key={key}>
								        	{ value }
								      	</div>
									)
									: ''
								}
							</div>

							<div className="mt-5 flex justify-content-end">
								<button className="button is-primary" id="changePassword">Simpan</button>
							</div>
						</form>
					</div>
				</div>

				<div className="grid grid-cols-2 bg-gray mt-5">
					<div className="pl-5 pt-5 pb-5">
						<h3 className="text-lg font-medium text-gray-900"> Perbarui Token Anda </h3>
						<p className="mt-1 text-sm text-gray-600"> Pastikan token Anda tidak disebar luaskan. </p>
					</div>

					<div className="bg-white pr-5 pt-5 pb-5 pl-5 form-wrap">
						<form onSubmit={(event) => generateToken(event)}>
							<div>
								<label className="bold">Token <span className="required">*</span></label>
								<div>{ token }</div>
							</div>

							<div className="mt-5 flex justify-content-end">
								<button className="button is-primary" id="generateToken">Generate Token Baru</button>
							</div>
						</form>
					</div>
				</div>

				<div className="w-full right mt-5">
					<button className="button is-black" id="logoutBtn" onClick={logout}>Logout</button>
				</div>
			</div>
		</div>
	)
}

export default Account