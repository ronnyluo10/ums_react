import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'

let headers = {}

const ItemPenjualanForm = (props) => {
	const [state, setState] = useState({
		kode_barang: '',
		qty: '',
	})

	const [title, setTitle] = useState('Tambah')

	const [barang, setBarang] = useState([])

	const [itemErrorMsg, setItemErrorMsg] = useState(null)

	const { uri, editUri } = props

	const { id_nota, kode_barang, nota } = useParams()

	const reactURI = process.env.REACT_APP_API_URL

	const navigate = useNavigate()

	const [errors, setErrors] = useState({})
	const [fullUrl, setFullUrl] = useState(reactURI+uri)

	useEffect(() => {
		const userData = localStorage.getItem('user')

		if(userData) {
			const { token } = JSON.parse(userData)

			headers = {
				headers: {
					Authorization: 'Bearer '+token
				},
			}

			getListOfBarang()

			if(id_nota && kode_barang && nota && editUri) {
				document.getElementById('pageloader').classList.remove('is-left-to-right')
				edit()
			}

			let uri = fullUrl

			if(nota && kode_barang) {
				
				uri += nota+"/"+kode_barang

			} else {
				if(id_nota) {
					uri += id_nota
				}
			}

			setFullUrl(fullUrl => uri)
		} else {
			navigate('/')
		}

	}, [])

	const getListOfBarang = () => {
		axios.get(reactURI+'/barang/list', headers).then(response => {
			setBarang(Object.entries(response.data.results))
		}).catch(error => {
			setItemErrorMsg('Gagal mendapatkan data barang')
			unknownError()
		})
	}

	const edit = () => {
		axios.get(reactURI+editUri+nota+"/"+kode_barang, headers).then(response => {
			const { kode_barang, qty } = response.data.results
			
			setTitle('Ubah')

			setState({
				kode_barang: kode_barang,
				qty: qty,
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

		if(nota && kode_barang) {
			newState = {
				...state,
				_method: 'PUT'
			}
		}

		axios.post(fullUrl, Object.keys(newState).length > 0 ?  newState: state, headers).then(response => {
			document.getElementById('pageloader').classList.add('is-left-to-right')
				
			document.getElementById('successNotification').classList.remove('hide')

			if(!kode_barang) {
				setState({
					kode_barang: '',
					qty: '',
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
				<strong>Berhasil</strong> simpan data item penjualan
			</div>

			<div className="notification is-danger hide" id="errorNotification">
				<button className="delete"></button>
				{ itemErrorMsg ? itemErrorMsg : 
					<div>
						<strong>Gagal</strong> simpan data item penjualan. Silahkan coba kembali atau hubungi customer service.
					</div>
				}
			</div>

			<div className="card mt-5">
				<header className="card-header">
					<p className="card-header-title">
						<Link to={'/penjualan/item/'+id_nota}>
							<svg className="svg-icon" viewBox="0 0 20 20">
								<path fill="black" d="M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0
								L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109
								c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483
								c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788
								S18.707,9.212,18.271,9.212z"></path>
							</svg>
						</Link>
						&nbsp;
						{ 'Form '+ title +' Item Penjualan' }
					</p>
				</header>

				<div className="card-content">
					<div className="content">
						{barang && (
	    					<div>
	    						<label className="bold">Kode Barang <span className="required">*</span></label>
	    						<div className="select">
	    							<select name="kode_barang" id="kode_barang" value={state.kode_barang || ''} onChange={handleChangeValue}>
	    								<option value="">Pilih</option>
	    								{ barang.map((value, key) => (
	    									<option key={key} value={value[0]}>
	    										{ value[1]+' ('+value[0]+')' }
	    									</option>
	    								)) }
	    							</select>
	    						</div>
	    					</div>
						)}

						{ errors && errors.kode_barang ? 
	    					errors.kode_barang.map((value, key) => (
	    						<div className="invalid-feedback" key={key}>
						        	{ value }
						      	</div>
	    					))
	    				: ''}

						<div className="mt-5">
							<label className="bold">Qty <span className="required">*</span></label>
							<input type="text" name="qty" id="qty" value={state.qty || ''} className="input is-normal" onChange={handleChangeValue} />
							{ errors && errors.qty  ? 
								errors.qty.map((value, key) => 
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

export default ItemPenjualanForm