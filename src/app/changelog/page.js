import axios from "axios";
import { CheckSquare } from "lucide-react";

export const getCommitsData = async () => {
    console.log("server side jalan");
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/changelog`
    );
    const commits = res.data;
    return commits;
};

const Changelog = async () => {
    const commits = await getCommitsData();
    let multipleCommits = null;

    const dateOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    return (
        <div className="flex flex-col px-6 py-2 text-white font-wayfinding">
            <span className="text-xl font-bold">Changelog Aplikasi</span>
            <div className="flex flex-col gap-1">
                {Array.isArray(commits) &&
                    commits.map((commit) => {
                        const commitDate = new Date(
                            commit.commit.committer.date
                        ).toLocaleDateString("id-ID", dateOptions);

                        if (commitDate !== multipleCommits) {
                            multipleCommits = commitDate;
                            return (
                                <div key={commit.sha} className="mt-2">
                                    <span className="font-bold underline underline-offset-4">
                                        {commitDate}
                                    </span>
                                    <ul className="ml-2">
                                        <li className="flex items-center gap-2">
                                            <CheckSquare className="w-4 h-4" />{" "}
                                            {commit.commit.message}
                                        </li>
                                    </ul>
                                </div>
                            );
                        } else {
                            return (
                                <div key={commit.sha}>
                                    <ul className="ml-2 -mt-1">
                                        <li className="flex items-center gap-2">
                                            <CheckSquare className="w-4 h-4" />{" "}
                                            {commit.commit.message}
                                        </li>
                                    </ul>
                                </div>
                            );
                        }
                    })}
            </div>
        </div>
    );
};

export default Changelog;
