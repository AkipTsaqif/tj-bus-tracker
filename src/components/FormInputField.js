import { alpha, styled } from '@mui/material/styles';
import { InputBase } from '@mui/material';

const CustomInputField = styled(InputBase)(({ theme }) => ({
	'& .MuiInputBase-input': {
		borderRadius: 6,
		position: 'relative',
		border: '1px solid #a6aaad',
		fontSize: 16,
		// width: "auto",
		padding: '10px 12px',
		marginTop: '-4px',
		transition: theme.transitions.create([
			'border-color',
			'background-color',
			'box-shadow',
		]),
		// Use the system font instead of the default Roboto font.
		'&:focus': {
			boxShadow: `${alpha('#038edc', 0.25)} 0 0 0 0.2rem`,
			borderColor: '#038edc',
		},
	},
	'& .MuiInputBase-input.Mui-disabled': {
		border: '1px solid #ced4da',
	},
}));

export const FormInputField = (props) => {
	return <CustomInputField {...props} />;
};
