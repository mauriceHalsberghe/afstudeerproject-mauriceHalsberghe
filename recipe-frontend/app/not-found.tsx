
import EmptyView from "./components/EmptyView";

export default function NotFound() {
  return (
    <EmptyView title="404" text="Page not found" icon="notfound" btnUrl="/" btnText="Home" centered={true} />
  );
}