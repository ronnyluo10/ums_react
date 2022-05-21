import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const PelangganList = () => {
	const [pelanggan, setPelanggan] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getPelanggan()
	}, [])

	const getPelanggan = async () => {
		const pelanggan = await axios.post(process.env.REACT_APP_API_URL+"/pelanggan", 
			{
				search: '',
				tbody: ['id_pelanggan', 'nama', 'domisili', 'jenis_kelamin'],
				sort: ['created_at', 'DESC'],
				offset: 1,
			}, 
			{
				headers : {
					Authorization: 'Bearer p0NZ09Pio3bwnevEnN6l1obYIhJ8pHJ8BgCEgGrW'
				}
			}
		).catch(error => {
			console.log(error)
		})

		setPelanggan(pelanggan)
		
		const pageloader = document.getElementById("pageloader")

		if(pageloader) {
			pageloader.classList.remove('is-left-to-right')
		}

		setTimeout(() => {
			if(pageloader) {
				pageloader.classList.add('is-left-to-right')
			}
		}, 1000)

		setTimeout(() => {
			setLoading(false)
		}, 1200)
	}

	return (
		<div>
			{ !loading ? <div>
				<Link to="/pelanggan/tambah" className="button is-primary mt-5">Tambah</Link>
				<table className="table is-striped is-fullwidth">
					<thead>
						<tr>
							<th>Id Pelanggan</th>
							<th>Nama</th>
							<th>Domisili</th>
							<th>Jenis Kelamin</th>
						</tr>
					</thead>

					{ pelanggan && pelanggan.data && (
						<tbody>
							{ pelanggan.data.results.data.map((value, key) => (
								<tr key={ key }>
									<td>{ value.id_pelanggan }</td>
									<td>{ value.nama }</td>
									<td>{ value.domisili }</td>
									<td>{ value.jenis_kelamin }</td>
								</tr>
							)) }
						</tbody>
					)}				
				</table>
			</div> : 
			<div className="pageloader is-left-to-right" id="pageloader">
				<div className="circle-loading">
					<div></div>
					<div></div>
				</div>
			</div> }
		</div>
	)
}

export default PelangganList