import { Form } from 'react-bootstrap'
import { LOCATIONS } from '../lib/rules'
export default function UserFields({
  values,
  onChange,
  prefix = 'user',
  canAssignAdmin = false,
  editing = false,
}) {
  const change = (key, value) =>
    onChange({
      ...values,
      [key]: value,
      ...(key === 'region' ? { comuna: '' } : {}),
    })
  return (
    <div className="admin-form-grid">
      {[
        [
          'nombre',
          editing ? 'Nombre del usuario' : 'Nombre completo',
          'text',
          50,
          'given-name',
        ],
        ['apellidos', 'Apellidos', 'text', 100, 'family-name'],
        ['run', editing ? 'RUN del usuario' : 'RUN', 'text', 9, 'off'],
        ['correo', 'Correo electrónico', 'email', 100, 'email'],
        ['password', 'Contraseña temporal', 'password', 10, 'new-password'],
        [
          'telefono',
          editing ? 'Teléfono del usuario' : 'Teléfono (opcional)',
          'tel',
          9,
          'tel-national',
        ],
        [
          'fechaNacimiento',
          'Fecha de nacimiento (opcional)',
          'date',
          undefined,
          'bday',
        ],
        [
          'direccion',
          editing ? 'Dirección del usuario' : 'Dirección',
          'text',
          300,
          'street-address',
        ],
      ]
        .filter(([key]) => !editing || !['correo', 'password'].includes(key))
        .map(([key, label, type, maxLength, autoComplete]) => (
          <Form.Group controlId={`${prefix}-${key}`} key={key}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
              type={type}
              required={!['telefono', 'fechaNacimiento'].includes(key)}
              maxLength={maxLength}
              minLength={key === 'password' ? 4 : undefined}
              autoComplete={autoComplete}
              value={values[key] ?? ''}
              onChange={(event) => change(key, event.target.value)}
            />
          </Form.Group>
        ))}
      {['region', 'comuna'].map((key) => (
        <Form.Group key={key} controlId={`${prefix}-${key}`}>
          <Form.Label>{key === 'region' ? 'Región' : 'Comuna'}</Form.Label>
          <Form.Select
            required
            value={values[key] || ''}
            disabled={key === 'comuna' && !values.region}
            onChange={(event) => change(key, event.target.value)}
          >
            <option value="">
              Selecciona {key === 'region' ? 'una región' : 'una comuna'}
            </option>
            {(key === 'region'
              ? Object.keys(LOCATIONS)
              : LOCATIONS[values.region] || []
            ).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </Form.Select>
        </Form.Group>
      ))}
      {!editing && (
        <Form.Group controlId={`${prefix}-rol`}>
          <Form.Label>Tipo de usuario</Form.Label>
          <Form.Select
            value={values.rol}
            onChange={(event) => change('rol', event.target.value)}
          >
            <option value="paciente">Cliente / Paciente</option>
            <option value="vendedor">Vendedor</option>
            <option value="medico">Médico Especialista</option>
            {canAssignAdmin && <option value="admin">Administrador</option>}
          </Form.Select>
        </Form.Group>
      )}
    </div>
  )
}
