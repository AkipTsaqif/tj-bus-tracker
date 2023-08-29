import { redirect } from "next/navigation";

const Daop = ({ params }) => {
    redirect(`/kci/${params.daop}/stations`);
};

export default Daop;
