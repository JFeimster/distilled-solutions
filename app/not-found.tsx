import Link from "next/link";
export default function NotFound() { return <section className="not-found wrap"><span className="eyebrow">404 / ROUTE NOT FOUND</span><h1>This path is not on the map.</h1><p>Return to the outcome desk and choose a current guide.</p><Link className="button button-orange" href="/">Back to Solutions <span aria-hidden="true">↗</span></Link></section>; }
