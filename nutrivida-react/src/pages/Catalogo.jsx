import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Container, Row, Col, Alert, Form } from 'react-bootstrap'
import TarjetaServicio from '../components/TarjetaServicio'
import { serviceList } from '../lib/admin'
import { readCategories } from '../lib/commerce'
import { useAdminData } from '../lib/useAdminData'
export default function Catalogo() {
  const services = useAdminData(serviceList)
  const categories = useAdminData(readCategories)
  const [search, setSearch] = useSearchParams()
  const [query, setQuery] = useState('')
  const offers = useLocation().pathname === '/ofertas'
  const filtered = services.filter(
    (item) =>
      (!offers || Number(item.descuento) > 0) &&
      (!search.get('categoria') ||
        item.categoria === search.get('categoria')) &&
      `${item.titulo} ${item.descripcion}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  return (
    <Container className="py-5">
      <h1 className="h2 mb-4 text-success">
        {offers ? 'Ofertas' : 'Nuestro Catálogo de Servicios'}
      </h1>
      <Row className="g-3 mb-4">
        <Col md={6}>
          <Form.Group controlId="catalog-search">
            <Form.Label>Buscar servicios</Form.Label>
            <Form.Control
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nombre o descripción"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="catalog-category">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={search.get('categoria') || ''}
              onChange={(event) => {
                const next = new URLSearchParams(search)
                if (event.target.value)
                  next.set('categoria', event.target.value)
                else next.delete('categoria')
                setSearch(next)
              }}
            >
              <option value="">Todas las categorías</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      {!filtered.length ? (
        <Alert variant="info">
          {offers
            ? 'No hay ofertas disponibles para estos filtros.'
            : 'No hay servicios disponibles para estos filtros.'}
        </Alert>
      ) : (
        <Row>
          {filtered.map((item) => (
            <Col key={item.id} md={6} lg={4} className="mb-4">
              <TarjetaServicio {...item} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}
