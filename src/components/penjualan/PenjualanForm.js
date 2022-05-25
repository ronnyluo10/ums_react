import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { comma } from "../../library/helpers.js"

let headers = {}

const PenjualanForm = (props) => {
	const [state, setState] = useState({
		tgl: '',
		pelanggan: '',
		barang: [],
		qty: [],
	})

	const [itemDecs, setItemDecs] = useState([])

	const [title, setTitle] = useState('Tambah')

	const [pelanggan, setPelanggan] = useState([])

	const [barang, setBarang] = useState([])

	const [itemErrorMsg, setItemErrorMsg] = useState(null)

	const [subtotal, setSubtotal] = useState(null)

	const { uri, editUri } = props

	const { id } = useParams()

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

			getListOfMaster()

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

	const getListOfMaster = () => {
		axios.get(reactURI+'/item-penjualan/master', headers).then(response => {
			const { pelanggan, barang } = response.data.results

			setPelanggan(Object.entries(pelanggan))
			setBarang(Object.entries(barang))
		}).catch(error => {
			setItemErrorMsg('Gagal mendapatkan data master')
			unknownError()
		})
	}

	const edit = () => {
		axios.get(reactURI+editUri+id, headers).then(response => {
			const { form_date, kode_pelanggan, subtotal } = response.data.results
			
			setTitle('Ubah')

			setState({
				tgl: form_date,
				pelanggan: kode_pelanggan,
			})

			setState(state => (
				{
					...state,
					subtotal: subtotal
				}
			))

			document.getElementById('pageloader').classList.add('is-left-to-right')

		}).catch(error => {
			document.getElementById('pageloader').classList.add('is-left-to-right')
			setItemErrorMsg('Gagal mendapatkan data edit')
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
					tgl: '',
					pelanggan: '',
				})
			}

			if(itemDecs.length > 0) {
				setItemDecs(itemDecs => [])
				setSubtotal(subtotal => null)
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

	const addItem = () => {
		const item_desc = document.getElementById('barang'), item_qty = document.getElementById('qty')

		if(Object.keys(errors).length > 0) {
			setErrors({})
		}

		if(item_desc.value && item_qty.value) {
			const text = item_desc.options[item_desc.selectedIndex].text.split("-")	
			const harga = text[1].split("(")
			const hargaValue = parseInt(harga[0].trim())
			const qty = parseInt(item_qty.value)
			const total = hargaValue * qty

			setItemDecs([
				...itemDecs,
				{
					kode: item_desc.value,
					nama: text[0],
					harga: comma(hargaValue),
					id: item_desc.value,
					qty: qty,
					total: total,
				}
			])

			let calculateSubTotal = subtotal

			if(!calculateSubTotal) {
				calculateSubTotal = total
			} else {
				calculateSubTotal += total
			}

			setSubtotal(subtotal => calculateSubTotal)

			state.barang.push(item_desc.value)
			state.qty.push(qty)

			setState(state)

			item_desc.value = ''
			item_qty.value = ''
		} else {
			setItemErrorMsg('Barang dan qty harus diisi')
			unknownError()
		}
	}

	const deleteItem = (key) => {
		if(itemDecs[key]) {
			state.barang.splice(key, 1)
			state.qty.splice(key, 1)

			const calculateSubTotal = subtotal - itemDecs[key].total

			setSubtotal(calculateSubTotal)

			itemDecs.splice(key, 1)

			setState(state)
			setItemDecs(itemDecs)
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
				<strong>Berhasil</strong> simpan data penjualan
			</div>

			<div className="notification is-danger hide" id="errorNotification">
				<button className="delete"></button>
				{ itemErrorMsg ? itemErrorMsg : 
					<div>
						<strong>Gagal</strong> simpan data penjualan. Silahkan coba kembali atau hubungi customer service.
					</div>
				}
			</div>

			<div className="card mt-5">
				<header className="card-header">
					<p className="card-header-title">
						<Link to="/penjualan">
							<svg className="svg-icon" viewBox="0 0 20 20">
								<path fill="black" d="M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0
								L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109
								c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483
								c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788
								S18.707,9.212,18.271,9.212z"></path>
							</svg>
						</Link>
						&nbsp;
						{ 'Form '+ title +' Penjualan' }
					</p>
				</header>

				<div className="card-content">
					<div className="content">
						<div>
							<label className="bold">Tanggal <span className="required">*</span></label>
							<input type="date" name="tgl" id="tgl" value={state.tgl || ''} className="input is-normal" onChange={handleChangeValue} />
							{ errors && errors.tgl  ? 
								errors.tgl.map((value, key) => 
									<div className="invalid-feedback" key={key}>
							        	{ value }
							      	</div>
								)
								: ''
							}
						</div>

						{pelanggan && (
							<div className="mt-5">
								<label className="bold">Kode Pelanggan <span className="required">*</span></label>
								<div className="select">
									<select name="pelanggan" id="pelanggan" value={ state.pelanggan || '' } onChange={handleChangeValue}>
										<option value="">Pilih</option>
										{ pelanggan.map((value, key) => (
											<option key={key} value={value[0]}>
												{ value[1]+' ('+value[0]+')' }
											</option>
										)) }
									</select>
								</div>
							</div>
						)}

						{ errors && errors.pelanggan  ? 
							errors.pelanggan.map((value, key) => 
								<div className="invalid-feedback" key={key}>
						        	{ value }
						      	</div>
							)
							: ''
						}

						{id && state.subtotal && (
							<div className="mt-5">
								<label className="bold">Subtotal <span className="required">*</span></label>
								<input type="text" name="subtotal" id="subtotal" value={comma(state.subtotal) || ''} className="input is-normal" onChange={handleChangeValue} />
									{ errors && errors.subtotal  ? 
										errors.subtotal.map((value, key) => 
											<div className="invalid-feedback" key={key}>
									        	{ value }
									      	</div>
										)
										: ''
									}
							</div>
						)}

						{ !id  && (
							<div className="mt-5">
								<fieldset>
		    						<legend>Item:</legend>

				    				<div className="grid grid-cols-2">
					    				<div>
					    					{barang && (
						    					<div>
						    						<label className="bold">Barang <span className="required">*</span></label>
						    						<div className="select">
						    							<select name="barang" id="barang">
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

					    					{ errors && errors.barang ? 
						    					errors.barang.map((value, key) => (
						    						<div className="invalid-feedback" key={key}>
											        	{ value }
											      	</div>
						    					))
						    				: ''}

					    					<div className="mt-5">
					    						<label className="bold">Qty <span className="required">*</span></label>
					    						<input type="number" name="qty" id="qty" className="input is-normal" />
					    					</div>

					    					{ errors && errors.qty ? 
						    					errors.qty.map((value, key) => (
						    						<div className="invalid-feedback" key={key}>
											        	{ value }
											      	</div>
						    					))
						    				: ''}

						    				<div className="mt-5">
						    					<button className="button is-info" onClick={() => addItem()}>Tambah</button>
						    				</div>
					    				</div>

					    				<div className="pd-5 pl-5">
					    					<table className="table is-striped is-fullwidth">
					    						<thead>
					    							<tr>
					    								<th>No</th>
					    								<th>Kode Barang</th>
					    								<th>Nama Barang</th>
					    								<th>Harga</th>
					    								<th>Qty</th>
					    								<th>Total</th>
					    							</tr>
					    						</thead>

					    						<tbody>
					    							{ itemDecs.map((value, key) => (
					    								<tr key={key}>
					    									<td>{ key + 1 }</td>
					    									<td>{ value.kode }</td>
					    									<td>{ value.nama }</td>
					    									<td>{ value.harga }</td>
					    									<td>{ value.qty }</td>
					    									<td>{ comma(value.total) }</td>
					    									<td>
					    										<button className="button is-danger" onClick={ () => deleteItem(key) }>Hapus</button>
					    									</td>
					    								</tr>
					    							)) }
					    						</tbody>

						    					{ subtotal && (
						    						<tfoot>
						    							<tr>
						    								<td colSpan="5" className="bold right">Subtotal</td>
						    								<td>
						    									{ comma(subtotal) }
						    								</td>
						    							</tr>
						    						</tfoot>
						    					)}
					    					</table>
					    				</div>
				    				</div>
								</fieldset>
							</div>
						)}
					</div>
				</div>
				
				<footer className="pl-5 pb-5">
					<button className="card-footer-item button is-primary" onClick={(event) => save(event)}>Simpan</button>
				</footer>
			</div>
		</div>
	)
}

export default PenjualanForm