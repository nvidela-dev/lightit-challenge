import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { FileDropzone } from './FileDropzone';

const createJpgFile = (name = 'test.jpg', size = 1024) =>
  new File([new ArrayBuffer(size)], name, { type: 'image/jpeg' });

const createPngFile = () =>
  new File(['test'], 'test.png', { type: 'image/png' });

const getFileInput = (): HTMLInputElement => {
  const input = document.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error('File input not found');
  }
  return input;
};

const ControlledDropzone = ({ maxSize }: { maxSize?: number }) => {
  const [file, setFile] = useState<File | null>(null);
  return <FileDropzone value={file} onChange={setFile} maxSize={maxSize} />;
};

describe('FileDropzone', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();
  });

  it('renders dropzone with instructions', () => {
    render(<FileDropzone value={null} onChange={vi.fn()} />);

    expect(screen.getByText(/Drag & drop your .jpg here/)).toBeInTheDocument();
    expect(screen.getByText(/click to browse/)).toBeInTheDocument();
    expect(screen.getByText('Maximum file size: 5.0 MB')).toBeInTheDocument();
  });

  it('opens file picker on click', async () => {
    const user = userEvent.setup();
    render(<FileDropzone value={null} onChange={vi.fn()} />);

    const fileInput = getFileInput();
    const clickSpy = vi.spyOn(fileInput, 'click');

    await user.click(screen.getByText(/Drag & drop/));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('accepts jpg file via file input', async () => {
    const user = userEvent.setup();
    render(<ControlledDropzone />);

    const fileInput = getFileInput();
    await user.upload(fileInput, createJpgFile());

    expect(screen.getByText('test.jpg')).toBeInTheDocument();
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
  });

  it('rejects non-jpg files', async () => {
    const user = userEvent.setup();
    render(<ControlledDropzone />);

    const fileInput = getFileInput();
    await user.upload(fileInput, createPngFile());

    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    expect(screen.getByText(/Drag & drop/)).toBeInTheDocument();
  });

  it('rejects files over max size', async () => {
    const user = userEvent.setup();
    render(<ControlledDropzone maxSize={500} />);

    const fileInput = getFileInput();
    await user.upload(fileInput, createJpgFile('large.jpg', 1000));

    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    expect(screen.getByText(/Drag & drop/)).toBeInTheDocument();
  });

  it('shows file preview with name and size', async () => {
    const user = userEvent.setup();
    render(<ControlledDropzone />);

    const fileInput = getFileInput();
    await user.upload(fileInput, createJpgFile('document.jpg', 2048));

    expect(screen.getByText('document.jpg')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
  });

  it('removes file on remove button click', async () => {
    const user = userEvent.setup();
    render(<ControlledDropzone />);

    const fileInput = getFileInput();
    await user.upload(fileInput, createJpgFile());

    expect(screen.getByAltText('Preview')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    expect(screen.getByText(/Drag & drop/)).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<FileDropzone value={null} onChange={vi.fn()} error="File is required" />);

    expect(screen.getByText('File is required')).toBeInTheDocument();
  });

  it('shows error styling on dropzone', () => {
    render(<FileDropzone value={null} onChange={vi.fn()} error="File is required" />);

    const dropzone = screen.getByText(/Drag & drop/).closest('div');
    expect(dropzone).toHaveClass('border-red-600');
  });

  it('handles drag over state', () => {
    render(<FileDropzone value={null} onChange={vi.fn()} />);

    const dropzone = screen.getByText(/Drag & drop/).closest('div')!;

    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveClass('border-primary');

    fireEvent.dragLeave(dropzone);
    expect(dropzone).toHaveClass('border-slate-200');
  });

  it('accepts file via drop', async () => {
    render(<ControlledDropzone />);

    const dropzone = screen.getByText(/Drag & drop/).closest('div')!;
    const file = createJpgFile();

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });

    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });
});
