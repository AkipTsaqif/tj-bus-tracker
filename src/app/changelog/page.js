import axios from "axios";
import _ from "lodash";
import { CheckSquare } from "lucide-react";

export const getCommitsData = async () => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/changelog`
    );
    const commits = res.data;

    const dateOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    const groupedCommits = _.groupBy(commits, (commit) =>
        new Date(commit.commit.committer.date).toLocaleDateString(
            "id-ID",
            dateOptions
        )
    );

    const modifiedCommits = _.map(groupedCommits, (commit, date) => ({
        sha: commit[0].sha,
        date,
        message: _.map(commit, (msg) => msg.commit.message),
    }));

    return modifiedCommits;
};

const Changelog = async () => {
    const commits = await getCommitsData();

    return (
        <div className="flex flex-col px-6 py-2 text-white font-wayfinding">
            <span className="text-xl font-bold">Daftar Perubahan Aplikasi</span>
            <div className="gap-8 columns-2">
                {Array.isArray(commits) &&
                    commits.map((commit) => (
                        <div
                            key={commit.sha}
                            className="mt-2 break-inside-avoid"
                        >
                            <span className="font-bold underline underline-offset-4">
                                {commit.date}
                            </span>
                            <ul className="ml-2">
                                {commit.message.map((msg) => (
                                    <li
                                        key={msg}
                                        className="flex items-center gap-2 mt-1"
                                    >
                                        <div className="w-4 h-4 flex-shrink-0">
                                            <CheckSquare className="w-full h-full" />
                                        </div>
                                        <p className="leading-[18px]">{msg}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Changelog;
