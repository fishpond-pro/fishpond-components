import { Link, Outlet } from "react-router-dom"

export default () => {
  return (
    <div>
      root

      <div>
        <Link to="/main">/main</Link>
      </div>
      <div>
        <Link to="/test">/test</Link>
      </div>

      <Outlet />
    </div>
  )
}
