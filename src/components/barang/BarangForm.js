import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { comma } from "../../library/helpers.js"

let headers = {}

const BarangForm = (props) => {
	const [state, setState] = useState({
		nama: '',
		kategori: '',
		harga: '',
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
			const { nama, kategori, harga } = response.data.results
			
			setTitle('Ubah')

			setState({
				nama: nama,
				kategori: kategori,
				harga: harga
			})

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

	const save = (event) => {
		event.preventDefault()

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
				setState({
					nama: '',
					kategori: '',
					harga: '',
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
				<strong>Berhasil</strong> simpan data barang
			</div>

			<div className="notification is-danger hide" id="errorNotification">
				<button className="delete"></button>
				<strong>Gagal</strong> simpan data barang. Silahkan coba kembali atau hubungi customer service.
			</div>

			<div className="card mt-5">
				<header className="card-header">
					<p className="card-header-title">
						<Link to="/barang">
							<svg className="svg-icon" viewBox="0 0 20 20">
								<path fill="black" d="M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0
								L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109
								c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483
								c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788
								S18.707,9.212,18.271,9.212z"></path>
							</svg>
						</Link>
						&nbsp;
						{ 'Form '+ title +' Barang' }
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
							<label className="bold">Kategori <span className="required">*</span></label>
							<input type="text" name="kategori" id="kategori" value={state.kategori || ''} className="input is-normal" placeholder="Contoh: AT" onChange={handleChangeValue} />
							{ errors && errors.kategori  ? 
								errors.kategori.map((value, key) => 
									<div className="invalid-feedback" key={key}>
							        	{ value }
							      	</div>
								)
								: ''
							}
						</div>

						<div className="mt-5">
							<label className="bold">Harga <span className="required">*</span></label>
							<input type="text" name="harga" id="harga" value={comma(state.harga) || ''} className="input is-normal" onChange={handleChangeValue} />
							{ errors && errors.harga  ? 
								errors.harga.map((value, key) => 
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

export default BarangForm