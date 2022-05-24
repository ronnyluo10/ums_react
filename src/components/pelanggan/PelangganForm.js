import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'

let headers = {}

const PelangganForm = (props) => {
	const [state, setState] = useState({
		nama: '',
		domisili: '',
		jenis_kelamin: '',
	})

	const [title, setTitle] = useState('Tambah')

	const { uri, editUri } = props

	const { id } = useParams()

	const reactURI = process.env.REACT_APP_API_URL

	const [errors, setErrors] = useState({})
	const [fullUrl, setFullUrl] = useState(reactURI+uri)

	const navigate = useNavigate()

	useEffect(() => {

		const userData = localStorage.getItem('user')

		if(userData) {
			const { token } = JSON.parse(userData)

			headers = {
				headers: {
					Authorization: 'Bearer '+token
				},
			}

			if(id && editUri) {
				document.getElementById('pageloader').classList.remove('is-left-to-right')
				edit()

				let uri = fullUrl+id
				setFullUrl(fullUrl => uri)
			}
		} else {
			navigate('/')
		}
	}, [])

	const edit = () => {
		axios.get(reactURI+editUri+id, headers).then(response => {
			const { nama, domisili, jenis_kelamin } = response.data.results
			
			setTitle('Ubah')

			setState({
				nama: nama,
				domisili: domisili,
				jenis_kelamin: jenis_kelamin
			})

			const element =document.getElementsByName('jenis_kelamin')

			for(var i = 0; i < element.length; i++) {
				if(jenis_kelamin.toLowerCase() == element[i].value.toLowerCase()) {
					element[i].checked = true
				}
			}

			document.getElementById('pageloader').classList.add('is-left-to-right')

		}).catch(error => {
			document.getElementById('pageloader').classList.add('is-left-to-right')
			unknownError()
		})
	}

	const handleChangeValue = (event) => {
		const { name, value } = event.currentTarget
		
		setState({
			...state,
			[name]: value
		})
	}

	const handleClickJenisKelamin = (event) => {
		state.jenis_kelamin = event.currentTarget.value
		setState(state)
	}

	const save = (event) => {
		event.preventDefault()
		console.log(headers)

		let newState = {}

		document.getElementById('pageloader').classList.remove('is-left-to-right')

		if(Object.keys(errors).length > 0) {
			setErrors({})
		}

		if(id) {
			newState = {
				...state,
				_method: 'PUT'
			}
		}

		axios.post(fullUrl, Object.keys(newState).length > 0 ?  newState: state, headers).then(response => {
			document.getElementById('pageloader').classList.add('is-left-to-right')
				
			document.getElementById('successNotification').classList.remove('hide')

			if(!id) {
				const element = document.getElementsByName("jenis_kelamin")

			   	for(var i = 0; i < element.length; i++)
			      	element[i].checked = false;

			    setState({
					nama: '',
					domisili: '',
					jenis_kelamin: '',
				})
			}

			setTimeout(() => {
				const successNotification = document.getElementById('successNotification')
				if(successNotification)
					successNotification.classList.add('hide')
			}, 5000)
		}).catch(error => {
			document.getElementById('pageloader').classList.add('is-left-to-right')

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
		<div className="container is-widescreen">
			<div className="pageloader is-left-to-right" id="pageloader">
				<div className="circle-loading">
					<div></div>
					<div></div>
				</div>
			</div>

			<div className="notification is-success hide" id="successNotification">
				<button className="delete"></button>
				<strong>Berhasil</strong> simpan data pelanggan
			</div>

			<div className="notification is-danger hide" id="errorNotification">
				<button className="delete"></button>
				<strong>Gagal</strong> simpan data pelanggan. Silahkan coba kembali atau hubungi customer service.
			</div>

			<div className="card mt-5">
				<header className="card-header">
					<p className="card-header-title">
						<Link to="/pelanggan">
							<svg className="svg-icon" viewBox="0 0 20 20">
								<path fill="black" d="M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0
								L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109
								c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483
								c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788
								S18.707,9.212,18.271,9.212z"></path>
							</svg>
						</Link>
						&nbsp;
						{ 'Form '+ title +' Pelanggan' }
					</p>
				</header>

				<div className="card-content">
					<div className="content">
						<div>
							<label className="bold">Nama <span className="required">*</span></label>
							<input type="text" name="nama" id="nama" value={state.nama || ''} className="input is-normal" onChange={handleChangeValue} />
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
							<label className="bold">Domisili <span className="required">*</span></label>
							<input type="text" name="domisili" id="domisili" value={state.domisili || ''} className="input is-normal" placeholder="Contoh: JAK-UT" onChange={handleChangeValue} />
							{ errors && errors.domisili  ? 
								errors.domisili.map((value, key) => 
									<div className="invalid-feedback" key={key}>
							        	{ value }
							      	</div>
								)
								: ''
							}
						</div>

						<div className="mt-5">
							<label className="bold">Jenis Kelamin <span className="required">*</span></label>
							&nbsp; &nbsp;
							<label>
								<input type="radio" value="PRIA" name="jenis_kelamin" onClick={(event) => handleClickJenisKelamin(event)} /> PRIA
							</label>
							&nbsp; &nbsp;
							<label>
								<input type="radio" value="WANITA" name="jenis_kelamin" onClick={(event) => handleClickJenisKelamin(event)} /> WANITA
							</label>
							{ errors && errors.jenis_kelamin  ? 
								errors.jenis_kelamin.map((value, key) => 
									<div className="invalid-feedback" key={key}>
							        	{ value }
							      	</div>
								)
								: ''
							}
						</div>
					</div>
				</div>
				
				<footer className="pl-5 pb-5">
					<button className="card-footer-item button is-primary" onClick={(event) => save(event)}>Simpan</button>
				</footer>
			</div>
		</div>
	)
}

export default PelangganForm