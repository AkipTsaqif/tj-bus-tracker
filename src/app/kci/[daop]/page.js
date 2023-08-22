import { redirect } from "next/navigation";

const Daop = ({ params }) => {
    redirect(`/kci/${params.daop}/all`);
};

export default Daop;
