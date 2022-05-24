import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

let getData
let headers = {}

const Datatables = (props) => {
	const { thead, tbody, uri, deleteField, deleteUri, createUri, updateUri, detailUri, moreField, encryptField, title } = props

	const navigate = useNavigate()

	const [loading, setLoading] = useState(true)
	const [result, setResult] = useState([])
	const [pagination, setPagination] = useState([])
	const [searchInput, setSearchInput] = useState([])
	const [params, setParams] = useState({
		search: '',
		tbody: tbody,
		offset: 1,
		sort: ['created_at', 'DESC']
	})
	const [deleteDescription, setDeleteDescription] = useState('')
	const [deleteId, setDeleteId] = useState('')
	const [header, setHeader] = useState([])
	
	const reactURL = process.env.REACT_APP_API_URL

	useEffect(() => {
		const userData = localStorage.getItem('user')

		if(userData) {
			const { token } = JSON.parse(userData)

			headers = {
				headers: {
					Authorization: 'Bearer '+token
				}
			}

			const loadingElement = document.getElementById('pageloader')
			let page = 0

			getData = async () => {
				callLoading()

				tableHeader()

				const result = await axios.post(reactURL+uri, params, headers).catch(error => {
					// unknownError()
				})

				setResult(result)

				if(result) {
					const { totalPage } = result.data.results
					
					page = totalPage
					
					let paginationNumber = [], paginationNext = [], paginationPrev = [], paginationEllipsis = [], paginationResult = []
					
					if(totalPage < 6) {
						for(let i = 1; i <= totalPage; i++) {
							var isCurrent1 = i === params.offset ? ' is-current' : ''
							paginationNumber.push(<li key={ i }><span className={'pagination-link'+isCurrent1} aria-label={ 'Goto page '+i } onClick={() => pagingClick(i)}>{ i }</span></li>)
						}
					} else {
						paginationPrev.push(<span key="prev" className="pagination-previous" onClick={() => previousPage()}>Previous</span>)

						paginationNext.push(<span key="next" className="pagination-next" onClick={() => nextPage()}>Next</span>)

						if(params.offset < 5) {
							
							for(let i = 1; i <= 5; i++) {
								var isCurrent2 = i === params.offset ? ' is-current' : ''
								paginationNumber.push(<li key={ i }><span className={'pagination-link'+isCurrent2} aria-label={ 'Goto page '+i } onClick={() => pagingClick(i)}>{ i }</span></li>)
							}
							
							paginationEllipsis.push(<li key="elips1"><span className="pagination-ellipsis">&hellip;</span></li>)
							
							paginationNumber.push(<li key={totalPage}><span className="pagination-link" aria-label={ 'Goto page '+totalPage  } onClick={() => pagingClick(totalPage)}>{ totalPage }</span></li>)
						} else {
							paginationNumber.push(<li key="1"><span className="pagination-link" aria-label="Goto page 1" onClick={() => pagingClick(1)}>1</span></li>)

							paginationNumber.push(<li key="elips1"><span className="pagination-ellipsis">&hellip;</span></li>)

							for(let i = 1; i <= totalPage; i++) {
								if(params.offset - 1 <= i && params.offset + 1 >= i) {
									var isCurrent3 = i === params.offset ? ' is-current' : ''
									paginationNumber.push(<li key={ i }><span className={'pagination-link'+isCurrent3} aria-label={ 'Goto page '+i } onClick={() => pagingClick(i)}>{ i }</span></li>)
								}
							}

							if(params.offset < totalPage && params.offset + 1 !== totalPage) {
								paginationNumber.push(<li key="elips2"><span className="pagination-ellipsis">&hellip;</span></li>)
								
								paginationNumber.push(<li key={ totalPage }><span className="pagination-link" aria-label={ 'Goto page '+totalPage  } onClick={() => pagingClick(totalPage)}>{ totalPage }</span></li>)
							}
						}
					}

					paginationResult.push(paginationPrev)
					paginationResult.push(paginationNext)
					paginationResult.push(paginationNumber)
					paginationResult.push(paginationEllipsis)

					setPagination(
						<nav className="pagination is-rounded" role="navigation" aria-label="pagination">
							<ul className="pagination-list justify-content-end">
								{ paginationResult }
							</ul>
						</nav>
					)

					setTimeout(() => {
						if(loadingElement) {
							loadingElement.classList.add('is-left-to-right')
						}

						setTimeout(() => {
							setLoading(false)
						}, 500)
					}, 1000)
				}
			}

			const appendSearch = () => {
				setSearchInput([<input key="search" type="search" className="input is-normal" placeholder="Search" onKeyDown={(event) => searching(event)} />])
			}

			const pagingClick = (number) => {
				params.offset = number
				
				reloadAction()
			}

			const previousPage = () => {
				if(params.offset > 1) {
					params.offset -= 1

					reloadAction()
				}
			}

			const nextPage = () => {
				if(params.offset < page) {
					params.offset += 1

					reloadAction()
				}
			}

			const searching = (event) => {
				const { value } = event.currentTarget

				if(event.key === 'Enter') {
					params.search = value
					params.sort = ['created_at', 'DESC']
					params.offset = 1

					reloadAction()
				}
			}

			const reloadAction = () => {
				callLoading()

				setParams(params)

				getData()
			}

			const callLoading = () => {
				if(loadingElement) {
					loadingElement.classList.remove('is-left-to-right')
				}
			}

			const replaceTextHead = (value) => {
				return value.replace(/\s/g, '_').toLowerCase()
			}

			const isDesc = (value) => {
				const sortResult = replaceTextHead(value) === params.sort[0].toLowerCase() && params.sort[1].toLowerCase() === 'desc'
				return sortResult
			}

			const sortClick = (value, type) => {
				params.sort = [replaceTextHead(value), type]
				reloadAction()
			}

			const tableHeader = () => {
				let headers = []
				for(let i = 0; i < thead.length; i++) {
					headers.push(<th key={ i }>
						<div className="pointer">
							{ isDesc(thead[i]) ? <span onClick={() => sortClick(thead[i], 'asc')}>{ thead[i] } &#10595;</span> : <span onClick={() => sortClick(thead[i], 'desc')}>{ thead[i] } &#10597;</span> }
						</div>
					</th>)
				}

				setHeader(headers)
			}

			appendSearch()
			
			getData()
		} else {
			navigate('/')
		}

	}, [])

	const unknownError = () => {
		document.getElementById('errorNotification').classList.remove('hide')

		setTimeout(() => {
			document.getElementById('errorNotification').classList.add('hide')
		}, 5000)
	}

	const deleteConfirm = (id, field, isMoreField) => {
		if(isMoreField && typeof field === 'object') {
			let description = '', actionID = ''

			for(let i = 0; i < field.length; i++) {
				description += field[i]
				actionID += field[i]

				if(i < field.length - 1) {
					description += ', '
					actionID += '/'
				}
			}

			setDeleteDescription(description)
			setDeleteId(actionID)
		} else {
			setDeleteDescription(field)
			setDeleteId(id)
		}

		document.getElementById('deleteModal').style.display = 'block'
	}

	const closeModalDelete = () => {
		document.getElementById('deleteModal').style.display = 'none'
	}

	const deleteAction = () => {
		const deleteBtn = document.getElementById('deleteBtn')
		deleteBtn.setAttribute('disabled', 'disabled')

		axios.post(reactURL+deleteUri+deleteId, {_method: 'DELETE'}, headers).then(response => {
			const successNotification = document.getElementById('successNotification')
			
			if(successNotification) {
				successNotification.classList.remove('hide')
				
				setTimeout(() => {
					successNotification.classList.add('hide')
				}, 5000)
			}
			
			deleteBtn.removeAttribute('disabled')
			
			getData()

			document.getElementById('deleteModal').style.display = 'none'
		}).catch(error => {
			document.getElementById('deleteModal').style.display = 'none'
			deleteBtn.removeAttribute('disabled')
			unknownError()
		})
	}

	const getMoreFields = (value) => {
		const fields = []
		let deleteURL = deleteUri, updateURL = updateUri+"/"+value[encryptField]

		for(let i = 0; i < moreField.length; i++) {
			deleteURL += "/"+value[moreField[i]]
			updateURL += "/"+value[moreField[i]]
			fields.push(value[moreField[i]])
		}

		return <span>
			<Link to={updateURL}>Ubah</Link> &nbsp; &#10072; &nbsp;
			<span className="pointer deleteData" onClick={() => deleteConfirm(deleteURL, fields, true)}>Hapus</span>
		</span>
	}

	return (
		<div>
			<div className="pageloader is-left-to-right" id="pageloader">
				<div className="circle-loading">
					<div></div>
					<div></div>
				</div>
			</div>

			<div className="notification is-success hide" id="successNotification">
				<button className="delete"></button>
				<strong>Berhasil</strong> hapus { deleteDescription }
			</div>

			<div className="notification is-danger hide" id="errorNotification">
				<button className="delete"></button>
				<strong>Oops</strong> terjadi kesalahan pada server. Silahkan coba kembali
			</div>

			<div className="modal" id="deleteModal">
				<div className="modal-background"></div>
				<div className="modal-card">
					<header className="modal-card-head">
						<p className="modal-card-title">{ 'Hapus '+title }</p>
						<button className="delete" aria-label="close" onClick={() => closeModalDelete()}></button>
					</header>
					<section className="modal-card-body">
						<p>Apakah Anda yakin untuk menghapus {deleteDescription}?</p>
					</section>
					<footer className="modal-card-foot">
						<button className="button is-danger" id="deleteBtn" onClick={() => deleteAction()}>Hapus</button>
						<button className="button" onClick={() => closeModalDelete()}>Batal</button>
					</footer>
				</div>
			</div>

			{ !loading && (
				<div>
					<div className="grid grid-cols-2 mt-5 mb-5">
						<div>
							<Link to={createUri} className="button is-primary">Tambah</Link>
						</div>
						<div className="flex justify-content-end items-center">
							{ searchInput }
						</div>
					</div>

					<div className="table-responsive">
						<table className="table is-striped is-fullwidth">
							<thead>
								<tr>
									{ header }
									<th>Action</th>
								</tr>
							</thead>

							{ typeof result !== 'undefined' && result.data ? 
								<tbody>
									{ result.data.results.data.map((value, key) => (
										<tr key={ key }>
											{ tbody.map(( body, bodyKey ) => <td key={ bodyKey }>{ value[body] }</td> ) }
											<td>
												{
													moreField ?

													getMoreFields(value)

													: <span>
														<Link to={updateUri+value.id}>Ubah</Link> &nbsp; &#10072; &nbsp;
														<span className="pointer deleteData" onClick={() => deleteConfirm(value.id, value[deleteField])}>Hapus</span>
													</span>
												}

												{ detailUri && (
													<span>
														&nbsp; &#10072; &nbsp;
														<Link to={detailUri+'/'+value.id}>Item</Link>
													</span>
												)}
											</td>
										</tr>
									)) }
								</tbody> :
								<tbody>
									<tr>
										<td colSpan={thead.length} align="center">Data tidak ditemukan</td>
									</tr>
								</tbody>
							}
							
							{ pagination && result.data.results.totalRow > 0 && (
								<tfoot>
									<tr>
										<td className="bold">{ 'Total: '+result.data.results.totalRow }</td>
										<td colSpan={thead.length}>{ pagination }</td>
									</tr>
								</tfoot>
							)}
						</table>
					</div>
				</div>
			)}
		</div>
	)
}

export default Datatables